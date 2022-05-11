import { FIREFOX_APP_IDS_MAP } from '../../constants';

const appId = FIREFOX_APP_IDS_MAP[process.env.BUILD_ENV];

export const firefoxManifest = {
    'applications': {
        'gecko': {
            'id': appId,
            'strict_min_version': '78.0',
        },
    },
    'options_ui': {
        'page': 'pages/options.html',
        'open_in_tab': true,
    },
    'chrome_settings_overrides': {
        'search_provider': {
            'name': 'Qwant',
            'keyword': 'www.qwant.com',
            'search_url': 'https://www.qwant.com/?q={searchTerms}&client=ext-firefox-sb',
            'favicon_url': 'https://www.qwant.com/favicon.ico',
            'suggest_url': 'https://api.qwant.com/api/suggest/?q={searchTerms}&client=opensearch',
            'encoding': 'UTF-8',
            'is_default': true,
        },
    },
    'permissions': [
        'storage',
    ],
    'optional_permissions': [
        'tabs',
        '<all_urls>',
        'webRequest',
        'webRequestBlocking',
        'webNavigation',
        'cookies',
    ],
};
