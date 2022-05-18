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
// import {
//    formatISO, getISOWeeksInYear, getYear, getMonth,
// } from 'date-fns';
import { localStorage } from '../storage';
import { utils } from '../utils/common';
import { subscriptions } from './filters/subscription';
import { prefs } from '../prefs';
import { log } from '../../common/log';
import { lazyGet, lazyGetClear } from '../utils/lazy';
import { translator } from '../../common/translators/translator';

const getDomainFromURL = (url) => {
    if (!url) return null;
    const parsed = new URL(url);
    const urlParts = parsed.hostname.replace('www.', '').split('.');
    return urlParts
        .slice(0)
        .slice(-(urlParts.length === 4 ? 3 : 2))
        .join('.');
};

/**
 * Global stats
 */
export const pageStats = (function () {
    // const MAX_HOURS_HISTORY = 24;
    // const MAX_DAYS_HISTORY = 30;
    // const MAX_MONTHS_HISTORY = 3;

    const TOTAL_GROUP = {
        groupId: 'total',
        groupName: translator.getMessage('popup_statistics_total'),
    };

    const pageStatisticProperty = 'page-statistic';

    const pageStatsHolder = {
        /**
         * Getter for total page stats (gets it from local storage)
         *
         * @returns {*}
         * @private
         */
        get stats() {
            return lazyGet(pageStatsHolder, 'stats', () => {
                let stats;
                try {
                    const json = localStorage.getItem(pageStatisticProperty);
                    if (json) {
                        stats = JSON.parse(json);
                    }
                } catch (ex) {
                    log.error(
                        'Error retrieve page statistic from storage, cause {0}',
                        ex,
                    );
                }
                return stats || Object.create(null);
            });
        },

        save: utils.concurrent.throttle(function () {
            localStorage.setItem(pageStatisticProperty, JSON.stringify(this.stats));
        }, prefs.statsSaveInterval),

        clear() {
            localStorage.removeItem(pageStatisticProperty);
            lazyGetClear(pageStatsHolder, 'stats');
        },
    };

    const getTotalRequests = () => {
        const { stats } = pageStatsHolder;
        if (!stats) {
            return 0;
        }
        return stats.totalRequests || 0;
    };

    const updateTotalRequests = (count) => {
        const { stats } = pageStatsHolder;
        stats.totalRequests = (stats.totalRequests || 0) + count;
        pageStatsHolder.save();
    };

    /**
   * Total count of blocked requests
   *
   * @returns {Number} Count of blocked requests
   */
    const getTotalBlocked = function () {
        const { stats } = pageStatsHolder;
        if (!stats) {
            return 0;
        }
        return stats.totalBlocked || 0;
    };

    /**
   * Updates total count of blocked requests
   *
   * @param blocked Count of blocked requests
   */
    const updateTotalBlocked = function (blocked) {
        const { stats } = pageStatsHolder;
        stats.totalBlocked = (stats.totalBlocked || 0) + blocked;
        pageStatsHolder.save();
    };

    const getBlockedDomains = () => {
        return pageStatsHolder.stats.blockedDomains || {};
    };

    const getAnnoyanceCountTotal = () => {
        return pageStatsHolder.stats.annoyanceCountTotal || 0;
    };

    const updateBlockedDomains = (domain) => {
        const now = new Date();

        if (!pageStatsHolder.stats.blockedDomains) {
            pageStatsHolder.stats.blockedDomains = initBlockedDomainsStruct(now, domain);
        } else {
            // eslint-disable-next-line max-len
            pageStatsHolder.stats.blockedDomains = updateBlockedDomainsStats(pageStatsHolder.stats.blockedDomains, domain);
        }

        pageStatsHolder.save();
    };

    /**
   * Resets tab stats
   */
    const resetStats = function () {
        pageStatsHolder.clear();
    };

    /**
   * Object used to cache bindings between filters and groups
   * @type {{filterId: {groupId: Number, groupName: String, displayNumber: Number}}}
   */
    const blockedGroupsFilters = {};

    // TODO check why not all filter stats appear here, for example cosmetic filters

    /**
   * Returns blocked group by filter id
   *
   * @param {number} filterId
   * @returns
   */
    const getBlockedGroupByFilterId = function (filterId) {
        let blockedGroup = blockedGroupsFilters[filterId];

        if (blockedGroup !== undefined) {
            return blockedGroup;
        }

        const filter = subscriptions.getFilter(filterId);
        if (!filter) {
            return undefined;
        }

        const group = subscriptions.getGroup(filter.groupId);
        if (!group) {
            return undefined;
        }

        const { groupId, groupName, displayNumber } = group;
        blockedGroup = { groupId, groupName, displayNumber };
        blockedGroupsFilters[filter.filterId] = blockedGroup;

        return blockedGroup;
    };

    // const createStatsDataItem = function (type, blocked) {
    //    const result = {};
    //    if (type) {
    //        result[type] = blocked;
    //    }
    //    result[TOTAL_GROUP.groupId] = blocked;
    //    return result;
    // };

    const initBlockedDomainsStruct = (now, domain) => {
        return {
            // day: {
            //    current: formatISO(now, { representation: 'date' }),
            //    domains: {
            //        [domain]: 1,
            //    },
            // },
            // week: {
            //    current: `${getISOWeeksInYear(now)}-${getYear(now)}`,
            //    domains: {
            //        [domain]: 1,
            //    },
            // },
            // month: {
            //    current: `${getMonth(now)}-${getYear(now)}`,
            //    domains: {
            //        [domain]: 1,
            //    },
            // },
            // year: {
            //    current: getYear(now),
            //    domains: {
            //        [domain]: 1,
            //    },
            // },
            total: {
                domains: {
                    [domain]: 1,
                },
            },
        };
    };

    /**
   * Blocked types to filters relation dictionary
   */
    const createStatsData = function (now, type, blocked, details) {
        const result = Object.create(null);

        result.updated = now.getTime();

        const domain = getDomainFromURL(details?.requestUrl);

        if (!domain) {
            return result;
        }

        result.blockedDomains = initBlockedDomainsStruct(now, domain);

        return result;
    };

    const incrementDomainCount = (domains = {}, domain) => {
        if (domains[domain]) {
            domains[domain] += 1;
        } else {
            domains[domain] = 1;
        }
        return domains;
    };

    const updateBlockedDomainsStats = (blockedDomains, domain) => {
        const result = blockedDomains || {};

        try {
            // const now = new Date()
            // if (!result.day || !result.week || !result.month || !result.year) {
            //    return initBlockedDomainsStruct(now, domain);
            // }

            /// / Day
            // if (result.day.current === formatISO(now, { representation: 'date' })) {
            //    result.day.domains = incrementDomainCount(result.day?.domains, domain);
            // } else {
            //    result.day = initBlockedDomainsStruct(now, domain).day;
            // }

            /// / Week
            // if (result.week.current === `${getISOWeeksInYear(now)}-${getYear(now)}`) {
            //    // eslint-disable-next-line max-len
            //    result.week.domains = incrementDomainCount(result.week?.domains, domain);
            // } else {
            //    result.week = initBlockedDomainsStruct(now, domain).week;
            // }

            /// / Month
            // if (result.month.current === `${getMonth(now)}-${getYear(now)}`) {
            //    // eslint-disable-next-line max-len
            //    result.month.domains = incrementDomainCount(result.month?.domains, domain);
            // } else {
            //    result.month = initBlockedDomainsStruct(now, domain).month;
            // }
            /// / Year
            // if (result.year.current === getYear(now)) {
            //    // eslint-disable-next-line max-len
            //    result.year.domains = incrementDomainCount(result.year?.domains, domain);
            // } else {
            //    result.year = initBlockedDomainsStruct(now, domain).year;
            // }

            // Total
            if (result.total) {
                result.total.domains = incrementDomainCount(result.total?.domains, domain);
            } else {
                result.total = {
                    domains: incrementDomainCount(result.total?.domains, domain),
                };
            }
        } catch (ex) {
            log.error(
                'updateStatsData: Error updating domain blocking statistics {0}',
                ex,
            );
        }

        return result;
    };

    const updateStatsData = function (now, type, blocked, current, details) {
        // const currentDate = new Date(current.updated);

        const result = current;
        result.updated = now.getTime();

        const domain = getDomainFromURL(details?.requestUrl);

        if (!domain) {
            return result;
        }

        if (!result.blockedDomains) {
            result.blockedDomains = initBlockedDomainsStruct(now, domain);
        } else {
            result.blockedDomains = updateBlockedDomainsStats(result.blockedDomains, domain);
        }

        return result;
    };

    /**
    * Updates stats data
    *
    * For every hour/day/month we have an object:
    * {
    *      blockedType: count,
    *      ..,
    *
    *      total: count
    * }
    *
    * We store last 24 hours, 30 days and all past months stats
    *
    * var data = {
    *              hours: [],
    *              days: [],
    *              months: [],
    *              updated: Date };
    *
    * @param filterId
    * @param blocked count
    * @param now date
    */
    const updateStats = function (filterId, blocked, now, details) {
        const blockedGroup = getBlockedGroupByFilterId(filterId);

        if (blockedGroup === undefined) {
            return;
        }

        const { groupId } = blockedGroup;
        const { stats } = pageStatsHolder;

        let updated;

        if (!stats.data) {
            updated = createStatsData(now, groupId, blocked, details);
        } else {
            updated = updateStatsData(now, groupId, blocked, stats.data, details);
        }

        pageStatsHolder.stats.data = updated;
        pageStatsHolder.save();
    };

    const getBlockedGroups = () => {
        const groups = subscriptions.getGroups().map((group) => {
            return {
                groupId: group.groupId,
                groupName: group.groupName,
                displayNumber: group.displayNumber,
            };
        });

        return [
            TOTAL_GROUP,
            ...groups.sort((prevGroup, nextGroup) => {
                return prevGroup.displayNumber - nextGroup.displayNumber;
            }),
        ];
    };

    /**
    * Returns statistics data object
    * @param {Date} [date] - used in the tests to provide time of stats object creation
    */
    const getStatisticsData = (date = new Date()) => {
        let { stats } = pageStatsHolder;
        if (!stats) {
            stats = {};
        }

        if (!stats.data) {
            stats.data = createStatsData(date, null, 0);
            pageStatsHolder.stats.data = stats.data;
            pageStatsHolder.save();
        }

        return {
            blockedDomains: stats.data.blockedDomains,
            blockedGroups: getBlockedGroups(),
        };
    };

    return {
        getDomainFromURL,
        resetStats,
        updateTotalBlocked,
        updateBlockedDomains,
        getBlockedDomains,
        updateStats,
        getTotalBlocked,
        getStatisticsData,
        getAnnoyanceCountTotal,
        getTotalRequests,
        updateTotalRequests,
    };
})();
