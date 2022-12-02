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

import * as TSUrlFilter from '@adguard/tsurlfilter';

import { utils } from '../utils/common';
import { allowlist } from './allowlist';
import { rulesStorage } from '../storage';
import { listeners } from '../notifier';
import { log } from '../../common/log';

/**
 * Class for manage user rules
 */
export const userrules = (function () {
    /**
     * Synthetic user filter
     */
    const userFilter = { filterId: utils.filters.USER_FILTER_ID };

    /**
     * Adds list of rules to the user filter
     *
     * @param rulesText List of rules to add
     */
    const addRules = function (rulesText) {
        listeners.notifyListeners(listeners.ADD_RULES, userFilter, rulesText);
    };

    /**
     * Removes all user's custom rules
     */
    const clearRules = function () {
        listeners.notifyListeners(listeners.UPDATE_FILTER_RULES, userFilter, []);
    };

    /**
     * Removes user's custom rule
     *
     * @param ruleText Rule text
     */
    const removeRule = function (ruleText) {
        listeners.notifyListeners(listeners.REMOVE_RULE, userFilter, [ruleText]);
    };

    /**
     * Save user rules text to storage
     * @param content Rules text
     */
    const updateUserRulesText = function (content) {
        const lines = content.length > 0 ? content.split(/\n/) : [];
        listeners.notifyListeners(listeners.UPDATE_FILTER_RULES, userFilter, lines);
    };

    /**
     * Loads user rules text from storage
     */
    const getUserRulesText = async function () {
        const rulesText = await rulesStorage.read(utils.filters.USER_FILTER_ID);
        const content = (rulesText || []).join('\n');
        return content;
    };

    const unAllowlistFrame = function (frameInfo) {
        if (frameInfo.frameRule) {
            if (frameInfo.frameRule.filterId === utils.filters.ALLOWLIST_FILTER_ID) {
                allowlist.unAllowlistUrl(frameInfo.url);
            } else {
                removeRule(frameInfo.frameRule.ruleText);
            }
        }
    };

    /**
     * Removes user rules by url
     * @param {string} url
     * @return {Promise<void>}
     */
    const removeRulesByUrl = async (url) => {
        const userRulesText = await getUserRulesText();
        const userRulesStrings = userRulesText.split('\n');
        const updatedUserRulesText = userRulesStrings
            .filter((userRuleString) => {
                return !TSUrlFilter.RuleSyntaxUtils.isRuleForUrl(
                    userRuleString,
                    url,
                );
            })
            .join('\n');
        updateUserRulesText(updatedUserRulesText);
    };

    /**
     * Checks if user rules have rules matching by url
     * @param {string} url
     * @return {Promise<boolean>}
     */
    const hasRulesForUrl = async (url) => {
        const userRulesText = await getUserRulesText();
        const userRulesStrings = userRulesText.split('\n');
        return userRulesStrings
            .some(userRuleString => TSUrlFilter.RuleSyntaxUtils.isRuleForUrl(
                userRuleString,
                url,
            ));
    };

    /**
     * Map rules conversion result
     * key is a result,
     * value is a source rule
     *
     * @type {Map<String, String>}
     */
    const conversionMap = new Map();

    /**
     * Converts rules text lines with conversion map
     *
     * @param rulesLines
     * @return {[String]}
     */
    const convertRules = (rulesLines) => {
        conversionMap.clear();

        const result = [];
        for (let i = 0; i < rulesLines.length; i += 1) {
            const line = rulesLines[i];
            let converted = [];
            try {
                converted = TSUrlFilter.RuleConverter.convertRule(line);
            } catch (e) {
                log.info(`Error converting rule ${line}, due to: ${e.message}`);
            }
            result.push(...converted);

            if (converted.length > 0) {
                if (converted.length > 1 || converted[0] !== line) {
                    // Fill the map only for converted rules
                    converted.forEach((x) => {
                        conversionMap.set(x, line);
                    });
                }
            }
        }

        log.debug('Converted {0} rules to {1} for user filter', rulesLines.length, result.length);

        return result;
    };

    /**
     * Returns source rule text if the rule has been converted
     *
     * @param ruleText
     * @return {String}
     */
    const getSourceRule = (ruleText) => {
        return conversionMap.get(ruleText);
    };

    return {
        addRules,
        clearRules,
        removeRule,
        updateUserRulesText,
        getUserRulesText,
        unAllowlistFrame,
        removeRulesByUrl,
        hasRulesForUrl,
        convertRules,
        getSourceRule,
    };
})();
