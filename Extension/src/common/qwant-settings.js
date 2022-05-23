const common = {
    'protocol-version': '1.0',
    'general-settings': {
        'allow-acceptable-ads': false,
        'show-blocked-ads-count': true,
        'autodetect-filters': false,
        'safebrowsing-enabled': false,
        'filters-update-period': -1,
        'appearance-theme': 'light',
    },
    'extension-specific-settings': {
        'use-optimized-filters': false,
        'collect-hits-count': true,
        'show-context-menu': false,
        'show-info-about-adguard': false,
        'show-app-updated-info': false,
        'hide-rate-adguard': false,
        'user-rules-editor-wrap': false,
    },
    stealth: {
        stealth_disable_stealth_mode: true,
        'stealth-hide-referrer': false,
        'stealth-hide-search-queries': false,
        'stealth-send-do-not-track': false,
        'stealth-block-webrtc': false,
        'stealth-remove-x-client': false,
        'stealth-block-third-party-cookies': false,
        'stealth-block-third-party-cookies-time': 2880,
        'stealth-block-first-party-cookies': false,
        'stealth-block-first-party-cookies-time': 4320,
        'block-known-trackers': false,
        'strip-tracking-parameters': false,
    },
};

const commonFilters = {
    'custom-filters': [],
    'user-filter': {
        rules: '',
        'disabled-rules': '',
        enabled: true,
    },
    whitelist: {
        inverted: false,
        domains: [],
        'inverted-domains': [],
        enabled: true,
    },
};

export const standard = {
    ...common,
    filters: {
        ...commonFilters,
        'enabled-groups': [2, 4, 5, 6],
        'enabled-filters': [
            // 2,
            3,
            10,
            15,
            // 16,
            17,
            // 113,
            118,
            122,
            207,
            208,
        ],

    },
};

const strict = {
    ...common,
    filters: {
        ...commonFilters,
        'enabled-groups': [2, 3, 4, 5, 6],
        'enabled-filters': [
            ...standard.filters['enabled-filters'],
            4,
            14,
            201,
            225,
            239,
        ],
    },

};

export const getQwantSettings = ({
    protectionLevel = 'standard',
}) => {
    return protectionLevel === 'strict' ? strict : standard;
};
