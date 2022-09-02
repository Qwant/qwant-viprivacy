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

/* eslint-disable max-len */

import { utils } from '../utils/common';
import { prefs } from '../prefs';
import { listeners } from '../notifier';
import { log } from '../../common/log';
import { localStorage } from '../storage';
import { browserUtils } from '../utils/browser-utils';
import { lazyGet } from '../utils/lazy';
import {
    APPEARANCE_THEMES,
} from '../../pages/constants';

/**
 * Object that manages user settings.
 * @constructor
 */
export const settings = (() => {
    const DEFAULT_FILTERS_UPDATE_PERIOD = -1;

    const settings = {
        DISABLE_DETECT_FILTERS: 'detect-filters-disabled',
        DISABLE_SHOW_PAGE_STATS: 'disable-show-page-statistic',
        SHOW_GLOBAL_STATS: 'show-global-stats',

        /* flag used to show link to comparison of desktop and browser adblocker versions */
        DISABLE_SHOW_ADGUARD_PROMO_INFO: 'show-info-about-adguard-disabled',

        DISABLE_SAFEBROWSING: 'safebrowsing-disabled',
        DISABLE_FILTERING: 'adguard-disabled',
        DISABLE_COLLECT_HITS: 'hits-count-disabled',
        DISABLE_SHOW_CONTEXT_MENU: 'context-menu-disabled',
        USE_OPTIMIZED_FILTERS: 'use-optimized-filters',
        DEFAULT_ALLOWLIST_MODE: 'default-whitelist-mode',
        ALLOWLIST_ENABLED: 'allowlist-enabled',
        DISABLE_SHOW_APP_UPDATED_NOTIFICATION: 'show-app-updated-disabled',
        FILTERS_UPDATE_PERIOD: 'filters-update-period',
        APPEARANCE_THEME: 'appearance-theme',

        /* User filter */
        USER_FILTER_ENABLED: 'user-filter-enabled',

        /* STEALTH MODE */
        DISABLE_STEALTH_MODE: 'stealth_disable_stealth_mode',
        HIDE_REFERRER: 'stealth-hide-referrer',
        HIDE_SEARCH_QUERIES: 'stealth-hide-search-queries',
        SEND_DO_NOT_TRACK: 'stealth-send-do-not-track',
        BLOCK_CHROME_CLIENT_DATA: 'stealth-remove-x-client',
        BLOCK_WEBRTC: 'stealth-block-webrtc',
        SELF_DESTRUCT_THIRD_PARTY_COOKIES: 'stealth-block-third-party-cookies',
        SELF_DESTRUCT_THIRD_PARTY_COOKIES_TIME: 'stealth-block-third-party-cookies-time',
        SELF_DESTRUCT_FIRST_PARTY_COOKIES: 'stealth-block-first-party-cookies',
        SELF_DESTRUCT_FIRST_PARTY_COOKIES_TIME: 'stealth-block-first-party-cookies-time',

        /* UI misc */
        HIDE_RATE_BLOCK: 'hide-rate-block',
        USER_RULES_EDITOR_WRAP: 'user-rules-editor-wrap',

        /* Protection level */
        PROTECTION_LEVEL: 'protection-level',
        PERMISSIONS_REJECTED: 'permissions-rejected',
    };

    const properties = Object.create(null);
    const propertyUpdateChannel = utils.channels.newChannel();

    /**
     * Lazy default properties
     */
    const defaultProperties = {
        get defaults() {
            return lazyGet(this, 'defaults', () => {
                // Initialize default properties
                const defaults = Object.fromEntries(Object.keys(settings).map(name => ([name, false])));

                defaults[settings.DISABLE_SHOW_ADGUARD_PROMO_INFO] = true;
                defaults[settings.DISABLE_SAFEBROWSING] = true;
                defaults[settings.DISABLE_COLLECT_HITS] = false;
                defaults[settings.SHOW_GLOBAL_STATS] = true;
                defaults[settings.DEFAULT_ALLOWLIST_MODE] = true;
                defaults[settings.ALLOWLIST_ENABLED] = true;
                defaults[settings.USE_OPTIMIZED_FILTERS] = prefs.mobile;
                defaults[settings.DISABLE_DETECT_FILTERS] = false;
                defaults[settings.DISABLE_SHOW_APP_UPDATED_NOTIFICATION] = true;
                defaults[settings.FILTERS_UPDATE_PERIOD] = DEFAULT_FILTERS_UPDATE_PERIOD;
                defaults[settings.DISABLE_STEALTH_MODE] = true;
                defaults[settings.HIDE_REFERRER] = true;
                defaults[settings.HIDE_SEARCH_QUERIES] = true;
                defaults[settings.SEND_DO_NOT_TRACK] = true;
                defaults[settings.BLOCK_CHROME_CLIENT_DATA] = !!browserUtils.isChromeBrowser();
                defaults[settings.BLOCK_WEBRTC] = false;
                defaults[settings.SELF_DESTRUCT_THIRD_PARTY_COOKIES] = true;
                defaults[settings.SELF_DESTRUCT_THIRD_PARTY_COOKIES_TIME] = 2880;
                defaults[settings.SELF_DESTRUCT_FIRST_PARTY_COOKIES] = false;
                defaults[settings.SELF_DESTRUCT_FIRST_PARTY_COOKIES_TIME] = 4320;
                defaults[settings.APPEARANCE_THEME] = APPEARANCE_THEMES.LIGHT;
                defaults[settings.USER_FILTER_ENABLED] = true;
                defaults[settings.HIDE_RATE_BLOCK] = false;
                defaults[settings.USER_RULES_EDITOR_WRAP] = false;
                defaults[settings.DISABLE_SHOW_CONTEXT_MENU] = true;
                defaults[settings.PROTECTION_LEVEL] = 'standard';
                return defaults;
            });
        },
    };

    const getProperty = function (propertyName) {
        if (propertyName in properties) {
            return properties[propertyName];
        }

        /**
         * Don't cache values in case of uninitialized storage
         */
        if (!localStorage.isInitialized()) {
            return defaultProperties.defaults[propertyName];
        }

        let propertyValue = null;

        if (localStorage.hasItem(propertyName)) {
            try {
                propertyValue = JSON.parse(localStorage.getItem(propertyName));
            } catch (ex) {
                log.error('Error get property {0}, cause: {1}', propertyName, ex);
            }
        } else if (propertyName in defaultProperties.defaults) {
            propertyValue = defaultProperties.defaults[propertyName];
        }

        properties[propertyName] = propertyValue;

        return propertyValue;
    };

    const setProperty = (propertyName, propertyValue) => {
        localStorage.setItem(propertyName, JSON.stringify(propertyValue));
        properties[propertyName] = propertyValue;
        propertyUpdateChannel.notify(propertyName, propertyValue);
        listeners.notifyListeners(listeners.SETTING_UPDATED, { propertyName, propertyValue });
    };

    const getAllSettings = function () {
        const result = {
            names: Object.create(null),
            values: Object.create(null),
            defaultValues: Object.create(null),
        };

        Object.entries(settings).forEach(([key, value]) => {
            const setting = settings[key];
            result.names[key] = setting;
            result.values[value] = getProperty(setting);
            result.defaultValues[value] = defaultProperties.defaults[setting];
        });

        return result;
    };

    /**
     * True if filtering is disabled globally.
     *
     * @returns {boolean} true if disabled
     */
    const isFilteringDisabled = function () {
        return getProperty(settings.DISABLE_FILTERING);
    };

    const changeFilteringDisabled = function (disabled) {
        setProperty(settings.DISABLE_FILTERING, disabled);
    };

    const isAutodetectFilters = function () {
        return !getProperty(settings.DISABLE_DETECT_FILTERS);
    };

    const changeAutodetectFilters = function (enabled, options) {
        setProperty(settings.DISABLE_DETECT_FILTERS, !enabled, options);
    };

    const showPageStatistic = function () {
        return !getProperty(settings.DISABLE_SHOW_PAGE_STATS);
    };

    const changeShowPageStatistic = function (enabled, options) {
        setProperty(settings.DISABLE_SHOW_PAGE_STATS, !enabled, options);
    };

    const showGlobalStats = function () {
        return !!getProperty(settings.SHOW_GLOBAL_STATS);
    };

    const isShowInfoAboutAdguardFullVersion = function () {
        return !getProperty(settings.DISABLE_SHOW_ADGUARD_PROMO_INFO);
    };

    const changeShowInfoAboutAdguardFullVersion = function (show, options) {
        setProperty(settings.DISABLE_SHOW_ADGUARD_PROMO_INFO, !show, options);
    };

    const isShowAppUpdatedNotification = function () {
        return !getProperty(settings.DISABLE_SHOW_APP_UPDATED_NOTIFICATION);
    };

    const isHideRateBlock = function () {
        return getProperty(settings.HIDE_RATE_BLOCK);
    };

    const isUserRulesEditorWrap = function () {
        return getProperty(settings.USER_RULES_EDITOR_WRAP);
    };

    const changeShowAppUpdatedNotification = function (show, options) {
        setProperty(settings.DISABLE_SHOW_APP_UPDATED_NOTIFICATION, !show, options);
    };

    const changeHideRateBlock = function (hide, options) {
        setProperty(settings.HIDE_RATE_BLOCK, hide, options);
    };

    const changeUserRulesEditorWrap = function (enabled, options) {
        setProperty(settings.USER_RULES_EDITOR_WRAP, enabled, options);
    };

    const changeEnableSafebrowsing = function (enabled, options) {
        setProperty(settings.DISABLE_SAFEBROWSING, !enabled, options);
    };

    const safebrowsingInfoEnabled = function () {
        return !getProperty(settings.DISABLE_SAFEBROWSING);
    };

    const collectHitsCount = function () {
        return !getProperty(settings.DISABLE_COLLECT_HITS);
    };

    const changeCollectHitsCount = function (enabled, options) {
        setProperty(settings.DISABLE_COLLECT_HITS, !enabled, options);
    };

    const showContextMenu = function () {
        return !getProperty(settings.DISABLE_SHOW_CONTEXT_MENU);
    };

    const changeShowContextMenu = function (enabled, options) {
        setProperty(settings.DISABLE_SHOW_CONTEXT_MENU, !enabled, options);
    };

    const isDefaultAllowlistMode = function () {
        return getProperty(settings.DEFAULT_ALLOWLIST_MODE);
    };

    const isUseOptimizedFiltersEnabled = function () {
        return getProperty(settings.USE_OPTIMIZED_FILTERS);
    };

    const changeUseOptimizedFiltersEnabled = function (enabled, options) {
        setProperty(settings.USE_OPTIMIZED_FILTERS, !!enabled, options);
    };

    const changeDefaultAllowlistMode = function (enabled) {
        setProperty(settings.DEFAULT_ALLOWLIST_MODE, enabled);
    };

    const setAllowlistEnabledState = (enabled) => {
        setProperty(settings.ALLOWLIST_ENABLED, enabled);
    };

    const getAllowlistEnabledState = () => {
        return getProperty(settings.ALLOWLIST_ENABLED);
    };

    const getProtectionLevel = () => {
        return getProperty(settings.PROTECTION_LEVEL);
    };

    const setProtectionLevel = (state) => {
        setProperty(settings.PROTECTION_LEVEL, state);
    };

    /**
     * Sets filters update period after conversion in number
     * @param period
     */
    const setFiltersUpdatePeriod = function (period) {
        let parsed = Number.parseInt(period, 10);
        if (Number.isNaN(parsed)) {
            parsed = DEFAULT_FILTERS_UPDATE_PERIOD;
        }
        setProperty(settings.FILTERS_UPDATE_PERIOD, parsed);
    };

    /**
     * Returns filter update period, converted in number
     * @returns {number}
     */
    const getFiltersUpdatePeriod = function () {
        const value = getProperty(settings.FILTERS_UPDATE_PERIOD);
        let parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed)) {
            parsed = DEFAULT_FILTERS_UPDATE_PERIOD;
        }
        return parsed;
    };

    const disableShowAdguardPromoInfo = function () {
        setProperty(settings.DISABLE_SHOW_ADGUARD_PROMO_INFO, true);
    };

    const isDisableShowAdguardPromoInfo = function () {
        return getProperty(settings.DISABLE_SHOW_ADGUARD_PROMO_INFO);
    };

    const getDisableStealthMode = () => getProperty(settings.DISABLE_STEALTH_MODE);
    const getSelfDestructThirdPartyCookies = () => getProperty(settings.SELF_DESTRUCT_THIRD_PARTY_COOKIES);
    const getSelfDestructThirdPartyCookiesTime = () => getProperty(settings.SELF_DESTRUCT_THIRD_PARTY_COOKIES_TIME);
    const getSelfDestructFirstPartyCookies = () => getProperty(settings.SELF_DESTRUCT_FIRST_PARTY_COOKIES);
    const getSelfDestructFirstPartyCookiesTime = () => getProperty(settings.SELF_DESTRUCT_FIRST_PARTY_COOKIES_TIME);
    const getHideReferrer = () => getProperty(settings.HIDE_REFERRER);
    const getHideSearchQueries = () => getProperty(settings.HIDE_SEARCH_QUERIES);
    const getSendDoNotTrack = () => getProperty(settings.SEND_DO_NOT_TRACK);
    const isWebRTCDisabled = () => getProperty(settings.BLOCK_WEBRTC);
    const isRemoveXClientData = () => getProperty(settings.BLOCK_CHROME_CLIENT_DATA);
    const getAppearanceTheme = () => getProperty(settings.APPEARANCE_THEME);

    const setDisableStealthMode = (value) => {
        setProperty(settings.DISABLE_STEALTH_MODE, value);
    };
    const setSelfDestructThirdPartyCookies = (value) => {
        setProperty(settings.SELF_DESTRUCT_THIRD_PARTY_COOKIES, value);
    };
    const setSelfDestructThirdPartyCookiesTime = (value) => {
        setProperty(settings.SELF_DESTRUCT_THIRD_PARTY_COOKIES_TIME, value);
    };
    const setSelfDestructFirstPartyCookies = (value) => {
        setProperty(settings.SELF_DESTRUCT_FIRST_PARTY_COOKIES, value);
    };
    const setSelfDestructFirstPartyCookiesTime = (value) => {
        setProperty(settings.SELF_DESTRUCT_FIRST_PARTY_COOKIES_TIME, value);
    };
    const setHideReferrer = (value) => {
        setProperty(settings.HIDE_REFERRER, value);
    };
    const setHideSearchQueries = (value) => {
        setProperty(settings.HIDE_SEARCH_QUERIES, value);
    };
    const setSendDoNotTrack = (value) => {
        setProperty(settings.SEND_DO_NOT_TRACK, value);
    };
    const setWebRTCDisabled = (value) => {
        setProperty(settings.BLOCK_WEBRTC, value);
    };
    const setRemoveXClientData = (value) => {
        setProperty(settings.BLOCK_CHROME_CLIENT_DATA, value);
    };
    const setAppearanceTheme = (theme) => {
        const isExistingTheme = Object.values(APPEARANCE_THEMES).some(t => t === theme);

        if (!isExistingTheme) {
            setProperty(settings.APPEARANCE_THEME, defaultProperties.defaults[settings.APPEARANCE_THEME]);
        } else {
            setProperty(settings.APPEARANCE_THEME, theme);
        }
    };

    const getUserFilterEnabled = () => {
        return getProperty(settings.USER_FILTER_ENABLED);
    };

    const setUserFilterEnabled = (state) => {
        setProperty(settings.USER_FILTER_ENABLED, state);
    };

    const api = { ...settings };

    api.getProperty = getProperty;
    api.setProperty = setProperty;
    api.getAllSettings = getAllSettings;

    api.onUpdated = propertyUpdateChannel;

    api.isFilteringDisabled = isFilteringDisabled;
    api.changeFilteringDisabled = changeFilteringDisabled;
    api.isAutodetectFilters = isAutodetectFilters;
    api.changeAutodetectFilters = changeAutodetectFilters;
    api.showPageStatistic = showPageStatistic;
    api.changeShowPageStatistic = changeShowPageStatistic;
    api.isShowInfoAboutAdguardFullVersion = isShowInfoAboutAdguardFullVersion;
    api.changeShowInfoAboutAdguardFullVersion = changeShowInfoAboutAdguardFullVersion;
    api.isShowAppUpdatedNotification = isShowAppUpdatedNotification;
    api.isHideRateBlock = isHideRateBlock;
    api.isUserRulesEditorWrap = isUserRulesEditorWrap;
    api.changeShowAppUpdatedNotification = changeShowAppUpdatedNotification;
    api.changeHideRateBlock = changeHideRateBlock;
    api.changeUserRulesEditorWrap = changeUserRulesEditorWrap;
    api.changeEnableSafebrowsing = changeEnableSafebrowsing;
    api.safebrowsingInfoEnabled = safebrowsingInfoEnabled;
    api.collectHitsCount = collectHitsCount;
    api.changeCollectHitsCount = changeCollectHitsCount;
    api.showContextMenu = showContextMenu;
    api.changeShowContextMenu = changeShowContextMenu;
    api.isDefaultAllowlistMode = isDefaultAllowlistMode;
    api.isUseOptimizedFiltersEnabled = isUseOptimizedFiltersEnabled;
    api.changeUseOptimizedFiltersEnabled = changeUseOptimizedFiltersEnabled;
    api.changeDefaultAllowlistMode = changeDefaultAllowlistMode;
    api.setAllowlistEnabledState = setAllowlistEnabledState;
    api.getAllowlistEnabledState = getAllowlistEnabledState;
    api.getFiltersUpdatePeriod = getFiltersUpdatePeriod;
    api.setFiltersUpdatePeriod = setFiltersUpdatePeriod;
    api.disableShowAdguardPromoInfo = disableShowAdguardPromoInfo;
    api.isDisableShowAdguardPromoInfo = isDisableShowAdguardPromoInfo;
    api.DEFAULT_FILTERS_UPDATE_PERIOD = DEFAULT_FILTERS_UPDATE_PERIOD;

    api.getDisableStealthMode = getDisableStealthMode;
    api.getSelfDestructThirdPartyCookies = getSelfDestructThirdPartyCookies;
    api.getSelfDestructThirdPartyCookiesTime = getSelfDestructThirdPartyCookiesTime;
    api.getSelfDestructFirstPartyCookies = getSelfDestructFirstPartyCookies;
    api.getSelfDestructFirstPartyCookiesTime = getSelfDestructFirstPartyCookiesTime;
    api.getHideReferrer = getHideReferrer;
    api.getHideSearchQueries = getHideSearchQueries;
    api.getSendDoNotTrack = getSendDoNotTrack;
    api.isWebRTCDisabled = isWebRTCDisabled;
    api.isRemoveXClientData = isRemoveXClientData;

    api.setDisableStealthMode = setDisableStealthMode;
    api.setSelfDestructThirdPartyCookies = setSelfDestructThirdPartyCookies;
    api.setSelfDestructThirdPartyCookiesTime = setSelfDestructThirdPartyCookiesTime;
    api.setSelfDestructFirstPartyCookies = setSelfDestructFirstPartyCookies;
    api.setSelfDestructFirstPartyCookiesTime = setSelfDestructFirstPartyCookiesTime;
    api.setHideReferrer = setHideReferrer;
    api.setHideSearchQueries = setHideSearchQueries;
    api.setSendDoNotTrack = setSendDoNotTrack;
    api.setWebRTCDisabled = setWebRTCDisabled;
    api.setRemoveXClientData = setRemoveXClientData;

    // Appearance mode methods
    api.setAppearanceTheme = setAppearanceTheme;
    api.getAppearanceTheme = getAppearanceTheme;

    // User filter settings
    api.getUserFilterEnabled = getUserFilterEnabled;
    api.setUserFilterEnabled = setUserFilterEnabled;

    // Default properties
    api.defaultProperties = defaultProperties.defaults;

    // Protection level
    api.getProtectionLevel = getProtectionLevel;
    api.setProtectionLevel = setProtectionLevel;

    // Global stats
    api.showGlobalStats = showGlobalStats;

    return api;
})();
