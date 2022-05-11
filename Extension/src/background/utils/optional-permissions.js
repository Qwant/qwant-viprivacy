import { browser } from '../extension-api/browser';
import { browserUtils } from './browser-utils';

const getPermissionsToRequest = () => {
    const permissions = {
        origins: [],
        permissions: [],
    };

    const { optional_permissions: optionalPermissions } = browser.runtime.getManifest();

    if (optionalPermissions.includes('<all_urls>')) {
        permissions.origins.push('<all_urls>');
        optionalPermissions.splice(optionalPermissions.indexOf('<all_urls>'), 1);
    }
    permissions.permissions = [...optionalPermissions];

    return permissions;
};

export const hasAllOptionalPermissions = async () => {
    const permissions = getPermissionsToRequest();
    return browserUtils.containsPermissions(permissions);
};

export const requestOptionalPermissions = async () => {
    const permissions = getPermissionsToRequest();
    return browserUtils.requestPermissions(permissions);
};
