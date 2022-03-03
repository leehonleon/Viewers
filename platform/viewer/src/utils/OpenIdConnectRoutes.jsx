import React from 'react';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import getUserManagerForConnectClient from './getUserManagerForConnectClient.js';

function _isAbsoluteUrl(url) {
  return url.includes('http://') || url.includes('https://');
}

function _makeAbsoluteIfNecessary(url, base_url) {
  if (_isAbsoluteUrl(url)) {
    return url;
  }

  /*
   * Make sure base_url and url are not duplicating slashes.
   */
  if (base_url[base_url.length - 1] === '/') {
    base_url = base_url.slice(0, base_url.length - 1);
  }

  return base_url + url;
}

const initUserManager = (oidc, routerBasename) => {
  if (!oidc || !oidc.length) {
    return;
  }

  const firstOpenIdClient = oidc[0];
  const { protocol, host } = window.location;
  const baseUri = `${protocol}//${host}${routerBasename}`;

  const redirect_uri = firstOpenIdClient.redirect_uri || '/goto';

  const openIdConnectConfiguration = Object.assign({}, firstOpenIdClient, {
    redirect_uri: _makeAbsoluteIfNecessary(redirect_uri, baseUri),
  });

  return getUserManagerForConnectClient(openIdConnectConfiguration);
}

function LoginComponent({ userManager, onRedirectSuccess ,onRedirectFailed}) {
  const queryParams = new URLSearchParams(location.search);
  const iss = queryParams.get('iss');
  const studyInstanceUIDs = queryParams.get('StudyInstanceUIDs');

  fetch(userManager.settings.authority,{
      method:'post',
      headers:{
          'Accept':'application/json,text/plain,*/*', /* 格式限制：json、文本、其他格式 */
          'Content-Type':'application/x-www-form-urlencoded', /* 请求内容类型 */
          'Authorization': `Bearer ${iss}`
      },
  }).then((response)=>{
      if (response.status != 200 ) {
        throw new Error(response.statusText);
      }
      return response.json()
  }).then((data)=>{
      onRedirectSuccess(data)
  }).catch(function(error){
      console.log(error)
      onRedirectFailed()
  });

  sessionStorage.setItem(
    'ohif-redirect-to',
    '/viewer?StudyInstanceUIDs=' + studyInstanceUIDs
  );

  return <div>Redirecting...</div>;
}

function OpenIdConnectRoutes({
                         oidc,
                         routerBasename,
                         UserAuthenticationService
                        }) {
  const userManager = initUserManager(oidc, routerBasename);

  const getAuthorizationHeader = () => {
    let state = UserAuthenticationService.getState()
    if (!state || !state.enabled || !state.user){
      handleUnauthenticated()
    }

    const user = UserAuthenticationService.getUser();

    return {
      Authorization: `Bearer ${user?.access_token}`
    };
  }

  const handleUnauthenticated = () => {
    return navigate(
      "/local"
    )

    return null;
  };

  const navigate = useNavigate();

  useEffect(() => {
    UserAuthenticationService.set({ enabled: true });

    UserAuthenticationService.setServiceImplementation({
      getAuthorizationHeader,
      handleUnauthenticated
    });
  }, [])

  const redirect_uri = new URL(userManager.settings.redirect_uri).pathname

  return (
    <Routes basename={routerBasename}>
      <Route
        path={redirect_uri}
        element={
          <LoginComponent userManager={userManager}
            onRedirectSuccess={(data) => {
              const path  = sessionStorage.getItem('ohif-redirect-to');

              UserAuthenticationService.setUser(data.token);

              navigate(path)
            }}
            onRedirectFailed={() => {
              UserAuthenticationService.setUser('');

              navigate('/local')
            }}
          />
        }
      />
    </Routes>
  );
}

export default OpenIdConnectRoutes;
