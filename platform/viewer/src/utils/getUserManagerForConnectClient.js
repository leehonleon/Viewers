import UserManager from './userManager';

/**
 * Creates a userManager from oidcSettings
 * LINK: https://github.com/IdentityModel/oidc-client-js/wiki#configuration
 *
 * @param {Object} oidcSettings
 * @param {string} oidcSettings.authServerUrl,
 * @param {string} oidcSettings.clientId,
 */
export default function getUserManagerForConnectClient(oidcSettings) {
  if (!oidcSettings) {
    return;
  }

  const settings = {
    ...oidcSettings,
  };

  const userManager = new UserManager(settings);

  return userManager;
}
