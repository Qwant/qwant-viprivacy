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

import { log } from '../common/log';
import { messenger } from '../pages/services/messenger';
import { browser } from './extension-api/browser';
import { startup } from './startup';

/**
 * Extension startup entry point
 */
export const start = async () => {
    log.info('Initializing');
    /* Send a native message to the android application (Qwant Browser) so that
    it is aware of the availability of the extension
    */
    const port = browser.runtime.connectNative('com.qwant.liberty');

    port.onMessage.addListener(response => {
        if (response?.action === 'back') {
            log.info('com.qwant.liberty: action: back');
            messenger.sendMessage('android-go-back');
        }
    });
    port.postMessage('hello');

    await startup();
};
