/* eslint-disable max-len */
import path from 'path';

export const ENVS = {
    DEV: 'dev',
    BETA: 'beta',
    RELEASE: 'release',
};

export const ENV_CONF = {
    [ENVS.DEV]: { outputPath: 'dev', mode: 'development' },
    [ENVS.BETA]: { outputPath: 'beta', mode: 'production' },
    [ENVS.RELEASE]: { outputPath: 'release', mode: 'production' },
};

export const BROWSERS = {
    CHROME: 'chrome',
    FIREFOX_AMO: 'firefox-amo',
    FIREFOX_STANDALONE: 'firefox-standalone',
    // OPERA: 'opera',
    EDGE: 'edge',
    // ADGUARD_API: 'adguard-api',
};

export const BROWSERS_CONF = {
    [BROWSERS.CHROME]: {
        browser: BROWSERS.CHROME,
        remoteScripts: true,
        devtools: true,
        buildDir: BROWSERS.CHROME,
    },
    [BROWSERS.FIREFOX_STANDALONE]: {
        browser: BROWSERS.FIREFOX_STANDALONE,
        remoteScripts: true,
        devtools: false,
        buildDir: BROWSERS.FIREFOX_STANDALONE,
    },
    [BROWSERS.FIREFOX_AMO]: {
        browser: BROWSERS.FIREFOX_AMO,
        remoteScripts: false,
        devtools: false,
        buildDir: BROWSERS.FIREFOX_AMO,
    },
    // [BROWSERS.OPERA]: {
    //    browser: BROWSERS.OPERA,
    //    remoteScripts: true,
    //    devtools: true,
    //    buildDir: BROWSERS.OPERA,
    // },
    [BROWSERS.EDGE]: {
        browser: BROWSERS.EDGE,
        remoteScripts: true,
        devtools: true,
        buildDir: BROWSERS.EDGE,
    },
    // [BROWSERS.ADGUARD_API]: {
    //    browser: BROWSERS.ADGUARD_API,
    //    remoteScripts: true,
    //    devtools: false,
    //    buildDir: BROWSERS.ADGUARD_API,
    // },
};

export const FIREFOX_APP_IDS_MAP = {
    [ENVS.DEV]: 'qwantprivacypilot-dev@qwant.com',
    [ENVS.BETA]: 'qwantprivacypilot-internal-beta-01@qwant.com',
    [ENVS.RELEASE]: 'qwantprivacypilot-prod@qwant.com',
};

export const BUILD_PATH = path.resolve(__dirname, '../build');

// filters constants
export const METADATA_DOWNLOAD_URL_FORMAT = 'https://f.qwant.com/tracking-protection/%browser_filters.json';
export const FILTERS_DEST = 'Extension/filters/%browser';
export const ADGUARD_FILTERS_IDS = [3, 10, 15, 17, 118, 122, 207, 208, 4, 14, 201, 225, 239];
export const LOCAL_SCRIPT_RULES_COMMENT = `By the rules of AMO we cannot use remote scripts (and our JS rules can be counted as such). Because of that we use the following approach (that was accepted by AMO reviewers):

1. We pre-build JS rules from AdGuard filters into the add-on (see the file called "local_script_rules.json").
2. At runtime we check every JS rule if it's included into "local_script_rules.json". If it is included we allow this rule to work since it's pre-built. Other rules are discarded.
3. We also allow "User rules" to work since those rules are added manually by the user. This way filters maintainers can test new rules before including them in the filters.`;

// artifacts constants
export const FIREFOX_CREDENTIALS = path.resolve(__dirname, '../private/AdguardBrowserExtension/mozilla_credentials.json');
export const FIREFOX_UPDATE_TEMPLATE = path.resolve(__dirname, './bundle/firefox/update_template.json');
export const FIREFOX_WEBEXT_UPDATE_URL = 'https://firefox-beta.cellar-c2.services.clever-cloud.com/update.json';
