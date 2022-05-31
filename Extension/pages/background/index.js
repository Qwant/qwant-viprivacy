import { start } from '../../src/background/start';
import { webrequest } from '../../src/background/webrequest';
import { requestSanitizer } from '../../src/background/filter/request-sanitizer';
import { localeDetect } from '../../src/background/filter/services/locale-detect';
import { messageHandler } from '../../src/background/message-handler';
import { tabsApi } from '../../src/background/tabs/tabs-api';
import { filtersUpdate } from '../../src/background/filter/filters/filters-update';
import { userrules } from '../../src/background/filter/userrules';

export const startTrackingBlocker = async () => {
    await start();
    webrequest.init();
    requestSanitizer.init();

    localeDetect.init();
    messageHandler.init();

    window.adguard = {
        tabs: tabsApi,
        filtersUpdate,
        userrules,
    };
};

startTrackingBlocker();
