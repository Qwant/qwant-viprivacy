export const chromeManifest = {
    'chrome_settings_overrides': {
        'search_provider': {
            'name': 'Qwant',
            'keyword': 'www.qwant.com',
            'search_url': 'https://www.qwant.com/?q={searchTerms}&client=ext-chrome-sb',
            'favicon_url': 'https://www.qwant.com/favicon.ico',
            'suggest_url': 'https://api.qwant.com/api/suggest/?q={searchTerms}&client=opensearch',
            'encoding': 'UTF-8',
            'is_default': true,
        },
    },
    'options_page': 'pages/options.html',
    'permissions': [
        '<all_urls>',
        'tabs',
        'webNavigation',
        'webRequest',
        'webRequestBlocking',
        'unlimitedStorage',
        'storage',
        'cookies',
    ],
    'optional_permissions': [
    ],
};
