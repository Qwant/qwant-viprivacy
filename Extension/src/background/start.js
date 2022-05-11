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
import { browser } from './extension-api/browser';
import { startup } from './startup';
import { hasAllOptionalPermissions } from './utils/optional-permissions';

/**
 * Extension startup entry point
 */
export const start = async () => {
    try {
        log.info('Initializing');
        const isPermissionsGranted = await hasAllOptionalPermissions();
        if (isPermissionsGranted) {
            log.info('Extensions has required permissions');
            await startup();
            return true;
        }
        log.info('Extensions missing required permissions');
        const arePermissionsRejected = localStorage?.getItem('permissions-rejected');
        if (arePermissionsRejected) {
            log.info('Permissions were previously rejected. Option page wont open. date={0}', arePermissionsRejected);
        } else {
            browser.runtime.openOptionsPage();
        }
        return false;
    } catch (e) {
        log.error(e);
        return false;
    }
};
