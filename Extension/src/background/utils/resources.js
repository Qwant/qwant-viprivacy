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

import { nanoid } from 'nanoid';
import { browser } from '../extension-api/browser';
import { redirectService } from '../filter/services/redirect-service';
import { redirectsTokensCache } from './redirects-tokens-cache';

/**
 * Web accessible resources helper
 */
export const resources = (function () {
    /**
     * Resources directory
     *
     * @type {string}
     */
    const WEB_ACCESSIBLE_RESOURCES = 'web-accessible-resources';

    /**
     * Foil ability of web pages to identify extension through its web accessible resources.
     *
     * Inspired by:
     * https://github.com/gorhill/uBlock/blob/7f999b7/platform/chromium/vapi-background.js
     */
    const warSecret = (() => {
        const root = browser.runtime.getURL('/');
        const secrets = [];
        let lastSecretTime = 0;

        // eslint-disable-next-line consistent-return
        const guard = function (details) {
            const { url } = details;
            const pos = secrets.findIndex(secret => url.lastIndexOf(`?secret=${secret}`) !== -1);
            if (pos === -1) {
                return { redirectUrl: root };
            }
            secrets.splice(pos, 1);
        };

        browser.webRequest?.onBeforeRequest?.addListener(
            guard,
            {
                urls: [`${root}${WEB_ACCESSIBLE_RESOURCES}/*`],
            },
            ['blocking'],
        );

        return () => {
            if (secrets.length !== 0) {
                if ((Date.now() - lastSecretTime) > 5000) {
                    secrets.splice(0);
                } else if (secrets.length > 256) {
                    secrets.splice(0, secrets.length - 192);
                }
            }
            lastSecretTime = Date.now();
            const secret = nanoid();
            secrets.push(secret);
            return `?secret=${secret}`;
        };
    })();

    /**
     * Load resources by path
     *
     * @param path
     * @return {Promise<string>}
     */
    const loadResource = async (path) => {
        const url = browser.runtime.getURL(`/${WEB_ACCESSIBLE_RESOURCES}/${path}${warSecret()}`);
        const response = await fetch(url);
        return response.text();
    };

    /**
     * Create url for redirect file
     *
     * @param {string} redirectFile
     * @param {string} requestUrl
     * @return {*}
     */
    const createRedirectFileUrl = (redirectFile, requestUrl) => {
        const params = new URLSearchParams(warSecret());
        if (redirectService.getBlockingRedirects().includes(redirectFile)) {
            const unblockToken = redirectsTokensCache.generateToken();
            params.set('__unblock', unblockToken);
            params.set('__origin', requestUrl);
        }
        return browser.runtime.getURL(`${WEB_ACCESSIBLE_RESOURCES}/redirects/${redirectFile}?${params.toString()}`);
    };

    // EXPOSE
    return {
        loadResource,
        createRedirectFileUrl,
    };
})();
