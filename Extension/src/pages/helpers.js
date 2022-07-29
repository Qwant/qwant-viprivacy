import { browserUtils } from '../background/utils/browser-utils';

/**
 * Awaits required period of time
 * @param timeoutMs
 * @returns {Promise<unknown>}
 */
export const sleep = (timeoutMs) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeoutMs);
    });
};

export const urls = {
    qwant: () => {
        const browser = browserUtils.getBrowser() || 'unknown';
        return `https://qwant.com/?client=ext-${browser.toLowerCase()}-sb`;
    },
};
