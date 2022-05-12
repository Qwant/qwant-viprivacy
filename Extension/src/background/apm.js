import { init as initApm } from '@elastic/apm-rum';

import { backgroundPage } from './extension-api/background-page';
import { browserUtils } from './utils/browser-utils';
import { log } from '../common/log';

export const apm = (() => {
    let agent;

    const init = (active) => {
        if (agent) {
            log.warn('APM agent already initialized');
            return;
        }

        const locale = backgroundPage.app.getLocale();
        const version = backgroundPage.app.getVersion();
        const browser = browserUtils.getBrowser();
        const platform = browserUtils.getPlatform();

        // eslint-disable-next-line max-len
        log.info('APM agent starting locale={0}, version={1}, browser={2}, platform={3}', locale, version, browser, platform);

        agent = initApm({
            serverUrl: 'https://www.qwant.com/apm/',
            serviceName: 'qwant-viprivacy',
            serviceVersion: version,
            flushInterval: 100,
            active,
        });

        log.info('APM agent active={0}, enabled={1}', agent.isActive(), agent.isEnabled());

        agent.addLabels({
            version, locale, platform, browser,
        });

        agent.observe('transaction:end', (transaction) => {
            log.debug('APM transaction:end type={0}, name={1}', transaction.type, transaction.name);
        });

        window.onerror = (...args) => {
            const error = args[4];
            agent.captureError(error);
            return false;
        };

        window.apm = agent;

        return agent;
    };

    return {
        init,
    };
})();
