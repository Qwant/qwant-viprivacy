import { FIREFOX_APP_IDS_MAP } from '../../constants';

const appId = FIREFOX_APP_IDS_MAP[process.env.BUILD_ENV];

export const firefoxManifest = {
    'applications': {
        'gecko': {
            'id': appId,
            'strict_min_version': '78.0',
        },
    },
    'permissions': [
        'storage',
        '<all_urls>',
        'webRequest',
        'webRequestBlocking',
        'webNavigation',
    ],
    'optional_permissions': [],
};
