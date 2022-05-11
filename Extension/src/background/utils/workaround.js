/**
 * We collect here all workarounds and ugly hacks:)
 */
export const workaround = (function () {
    const WorkaroundUtils = {
        /**
         * Converts blocked counter to the badge text.
         * Workaround for FF - make 99 max.
         *
         * @param blocked Blocked requests count
         */
        getBlockedCountText(blocked, isFirefoxBrowser) {
            const MAX = isFirefoxBrowser ? 99 : 999;
            let blockedText = blocked === '0' ? '' : blocked;
            if (blocked - 0 > MAX) {
                blockedText = '\u221E';
            }

            return blockedText;
        },
    };

    return WorkaroundUtils;
})();
