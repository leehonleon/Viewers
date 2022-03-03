import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@ohif/ui';

// Route Components
import DataSourceWrapper from './DataSourceWrapper';
import WorkList from './WorkList';
import Local from './Local';
import NotFound from './NotFound';
import buildModeRoutes from './buildModeRoutes';

// TODO: Make these configurable
// TODO: Include "routes" debug route if dev build
const bakedInRoutes = [
  // WORK LIST
  {
    path: '/',
    children: DataSourceWrapper,
    private: true,
    props: { children: WorkList },
  },
  {
    path: '/local',
    children: Local,
  },
  // NOT FOUND (404)
  { component: NotFound },
];

const createRoutes = ({
  modes,
  dataSources,
  extensionManager,
  servicesManager,
  hotkeysManager,
  routerBasename,
}) => {
  const routes =
    buildModeRoutes({
      modes,
      dataSources,
      extensionManager,
      servicesManager,
      hotkeysManager,
    }) || [];

  const allRoutes = [...routes, ...bakedInRoutes];

  function RouteWithErrorBoundary({ route, handleUnauthenticated, ...rest }) {
    if (route.private === true) {
      let state = UserAuthenticationService.getState();
      if (!state || !state.user) {
        handleUnauthenticated();
      }
    }

    return (
      <ErrorBoundary context={`Route ${route.path}`} fallbackRoute="/">
        <route.children
          {...rest}
          {...route.props}
          route={route}
          servicesManager={servicesManager}
          hotkeysManager={hotkeysManager}
        />
      </ErrorBoundary>
    );
  }

  const { UserAuthenticationService } = servicesManager.services;

  return (
    <Routes basename={routerBasename}>
      {allRoutes.map((route, i) => {
        return (
          <Route
            key={i}
            path={route.path}
            element={
              <RouteWithErrorBoundary
                route={route}
                handleUnauthenticated={
                  UserAuthenticationService.handleUnauthenticated
                }
              />
            }
          />
        );
      })}
    </Routes>
  );
};

export default createRoutes;
