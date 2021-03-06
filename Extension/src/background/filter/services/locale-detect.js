/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

import { listeners } from '../../notifier';
import { application } from '../../application';
import { tabsApi } from '../../tabs/tabs-api';
import { subscriptions } from '../filters/subscription';
import { settings } from '../../settings/user-settings';
import { utils } from '../../utils/common';
import { browserUtils } from '../../utils/browser-utils';
import { browser } from '../../extension-api/browser';

/**
 * Initialize LocaleDetectService.
 *
 * This service is used to auto-enable language-specific filters.
 */
export const localeDetect = (function () {
    const browsingLanguages = [];

    const SUCCESS_HIT_COUNT = 3;
    const MAX_HISTORY_LENGTH = 10;

    const domainToLanguagesMap = {
        // Russian
        'ru': 'ru',
        'ua': 'ru',
        'by': 'ru',
        'kz': 'ru',
        // English
        'com': 'en',
        'au': 'en',
        'uk': 'en',
        'nz': 'en',
        // German
        'de': 'de',
        'at': 'de',
        // Japanese
        'jp': 'ja',
        // Dutch
        'nl': 'nl',
        // French
        'fr': 'fr',
        // Spanish
        'es': 'es',
        // Italian
        'it': 'it',
        // Portuguese
        'pt': 'pt',
        // Polish
        'pl': 'pl',
        // Czech
        'cz': 'cs',
        // Bulgarian
        'bg': 'bg',
        // Lithuanian
        'lt': 'lt',
        // Latvian
        'lv': 'lv',
        // Arabic
        'eg': 'ar',
        'dz': 'ar',
        'kw': 'ar',
        'ae': 'ar',
        // Slovakian
        'sk': 'sk',
        // Romanian
        'ro': 'ro',
        // Suomi
        'fi': 'fi',
        // Icelandic
        'is': 'is',
        // Norwegian
        'no': 'no',
        // Greek
        'gr': 'el',
        // Hungarian
        'hu': 'hu',
        // Hebrew
        'il': 'he',
        // Chinese
        'cn': 'zh',
        // Indonesian
        'id': 'id',
        // Turkish
        'tr': 'tr',
    };

    /**
     * Called when LocaleDetectorService has detected language-specific filters we can enable.
     *
     * @param filterIds List of detected language-specific filters identifiers
     * @private
     */
    async function onFilterDetectedByLocale(filterIds) {
        if (!filterIds) {
            return;
        }

        const enabledFilters = await application.addAndEnableFilters(filterIds, { forceGroupEnable: true });

        if (enabledFilters.length > 0) {
            listeners.notifyListeners(listeners.ENABLE_FILTER_SHOW_POPUP, enabledFilters);
        }
    }

    /**
     * Stores language in the special array containing languages of the last visited pages.
     * If user has visited enough pages with a specified language we call special callback
     * to auto-enable filter for this language
     *
     * @param language Page language
     * @private
     */
    function detectLanguage(language) {
        /**
         * For an unknown language "und" will be returned
         * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/detectLanguage
         */
        if (!language || language === 'und') {
            return;
        }

        browsingLanguages.push({
            language,
            time: Date.now(),
        });
        if (browsingLanguages.length > MAX_HISTORY_LENGTH) {
            browsingLanguages.shift();
        }

        const history = browsingLanguages.filter((h) => {
            return h.language === language;
        });

        if (history.length >= SUCCESS_HIT_COUNT) {
            const filterIds = subscriptions.getFilterIdsForLanguage(language);
            onFilterDetectedByLocale(filterIds);
        }
    }

    /**
     * Detects language for the specified page
     * @param tab    Tab
     * @param url    Page URL
     */
    async function detectTabLanguage(tab, url) {
        if (!settings.isAutodetectFilters() || settings.isFilteringDisabled()) {
            return;
        }

        // Check language only for http://... tabs
        if (!utils.url.isHttpRequest(url)) {
            return;
        }

        // tabs.detectLanguage doesn't work in Opera
        // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/997
        if (!browserUtils.isOperaBrowser()) {
            if (tab.tabId && browser.tabs && browser.tabs.detectLanguage) {
                // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/detectLanguage
                try {
                    const language = await browser.tabs.detectLanguage(tab.tabId);
                    detectLanguage(language);
                } catch (e) {
                    // do nothing
                }
                return;
            }
        }

        // Detecting language by top-level domain if extension API language detection is unavailable
        // Ignore hostnames which length is less or equal to 8
        // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1354
        const host = utils.url.getDomainName(url);
        if (host && host.length > 8) {
            const parts = host ? host.split('.') : [];
            const tld = parts[parts.length - 1];
            const lang = domainToLanguagesMap[tld];
            detectLanguage(lang);
        }
    }

    const init = () => {
        // Locale detect
        tabsApi.onUpdated.addListener((tab) => {
            if (tab.status === 'complete') {
                detectTabLanguage(tab, tab.url);
            }
        });
    };

    return {
        init,
    };
})();
