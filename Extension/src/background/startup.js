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
import { backgroundPage } from './extension-api/background-page';
import { rulesStorage, localStorage } from './storage';
import { allowlist } from './filter/allowlist';
import { filteringLog } from './filter/filtering-log';
import { uiService } from './ui-service';
import { application } from './application';
import { MESSAGE_TYPES } from '../common/constants';
import { getQwantSettings } from '../common/qwant-settings';
import { browser } from './extension-api/browser';
import { settingsProvider } from './settings/settings-provider';

/**
 * Extension initialize logic. Called from start.js
 */
export const startup = async function () {
    async function onLocalStorageLoaded() {
        const version = backgroundPage.app.getVersion();
        const id = backgroundPage.app.getId();

        log.info(
            'Starting extension. Version="{0}", Id="{1}"',
            version,
            id,
        );

        if (!localStorage.hasItem('install-date')) {
            log.info('Extension first run');
            localStorage.setItem('install-date', Date.now());
        } else {
            log.info('Extension installed on {0}', localStorage.getItem('install-date'));
        }

        // Initialize popup button
        backgroundPage.browserAction.setPopup({
            popup: backgroundPage.getURL('pages/popup.html'),
        });

        // Set uninstall page url
        try {
            const uninstallUrl = backgroundPage.i18n.getMessage('uninstall_url');
            await browser.runtime.setUninstallURL(uninstallUrl);
        } catch (e) {
            log.error(e);
        }

        allowlist.init();
        filteringLog.init();
        await uiService.init();
        // stealthService.init();

        /**
         * Start application
         */
        application.start({
            async onInstall() {
                try {
                    log.info('Apply default Qwant settings..');
                    const qwantSettings = getQwantSettings({ protectionLevel: 'standard' });

                    const result = await settingsProvider.applySettingsBackup(JSON.stringify(qwantSettings));
                    if (result) {
                        log.info('Qwant settings applied successfully');
                        setTimeout(() => {
                            // TODO figure out how this works and how to avoid the 10s timeout
                            browser.runtime.sendMessage({
                                type: MESSAGE_TYPES.QWANT_SETTINGS_APPLIED,
                            });
                        }, 10000);
                    } else {
                        log.error('Error applying Qwant settings: unknown', qwantSettings);
                    }
                } catch (e) {
                    log.error('Error applying Qwant settings: {0}', e.message);
                }
            },
        });
    }

    await rulesStorage.init();
    await localStorage.init();
    onLocalStorageLoaded();
};
