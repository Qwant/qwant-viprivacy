import { createMachine, assign } from 'xstate';
import { browserUtils } from '../../../background/utils/browser-utils';

export const States = {
    SELECT_MODE: 'select_setting',
    REQUEST_PERMISSIONS: 'request_permissions',
    PROTECTION_LEVEL: 'protection_level',
    TELEMETRY: 'telemetry',
    PERMISSIONS_REJECTED: 'permissions_rejected',
    THANK_YOU: 'thank_you',
};

export const Events = {
    NEXT: 'NEXT',
    ENABLE_PROTECTION: 'ENABLE_PROTECTION',
    DISMISS_ALERT: 'DISMISS_ALERT',
    DISABLE_PROTECTION: 'DISABLE_PROTECTION',
    SEARCH_ONLY: 'SEARCH_ONLY',
    PREVIOUS: 'PREVIOUS',
    REJECT_PERMISSIONS: 'PERMISSIONS',
    PERMISSIONS_ALREADY_GRANTED: 'PERMISSIONS_ALREADY_GRANTED',
    GO_TO_REQUEST_PERMISSIONS: 'GO_TO_REQUEST_PERMISSIONS',
};

const isChrome = browserUtils.isChromeBrowser();
const isEdge = browserUtils.isEdgeChromiumBrowser();
const isFirefox = browserUtils.isFirefoxBrowser();
const protectionEnabled = true;

export const stateMachine = createMachine({
    id: 'onboarding-steps',
    initial: States.SELECT_MODE,
    context: {
        isChrome,
        isEdge,
        isFirefox,
        protectionEnabled,
        showPermissionAlert: false,
    },
    states: {
        [States.SELECT_MODE]: {
            on: {
                [Events.ENABLE_PROTECTION]: {
                    actions: assign({ protectionEnabled: true }),
                    target: States.SELECT_MODE,
                },
                [Events.DISMISS_ALERT]: {
                    actions: assign({ showPermissionAlert: false }),
                    target: States.SELECT_MODE,
                },
                [Events.DISABLE_PROTECTION]: {
                    actions: assign({ protectionEnabled: false }),
                    target: States.SELECT_MODE,
                },
                [Events.NEXT]: [{
                    actions: assign({ showPermissionAlert: false }),
                    target: States.REQUEST_PERMISSIONS,
                    cond: (context) => context.protectionEnabled,
                }, {
                    actions: assign({ showPermissionAlert: false }),
                    target: States.THANK_YOU,
                    cond: (context) => !context.protectionEnabled,
                }],
            },
            meta: {
            },
        },
        [States.REQUEST_PERMISSIONS]: {
            on: {
                [Events.NEXT]: States.PROTECTION_LEVEL,
                [Events.REJECT_PERMISSIONS]: {
                    target: States.SELECT_MODE,
                    actions: [
                        assign({ showPermissionAlert: true, protectionEnabled: false }),
                    ],
                },
                [Events.PERMISSIONS_ALREADY_GRANTED]: States.THANK_YOU,
                [Events.PREVIOUS]: States.SELECT_MODE,
            },
            meta: {
            },
        },
        [States.PROTECTION_LEVEL]: {
            on: {
                [Events.NEXT]: States.TELEMETRY,
                [Events.PREVIOUS]: States.REQUEST_PERMISSIONS,
            },
            meta: {
            },
        },
        [States.TELEMETRY]: {
            on: {
                [Events.NEXT]: States.THANK_YOU,
                [Events.PREVIOUS]: States.PROTECTION_LEVEL,
            },
            meta: {
            },
        },
        [States.THANK_YOU]: {
            type: 'final',
            meta: {
                skip: true,
            },
        },
    },
});
