import { createMachine, assign } from 'xstate';
import { browserUtils } from '../../../background/utils/browser-utils';

export const States = {
    SELECT_MODE: 'select_setting',
    REQUEST_PERMISSIONS: 'request_permissions',
    PROTECTION_LEVEL: 'protection_level',
    PIN_EXTENSION: 'pin_extension',
    TELEMETRY: 'telemetry',
    PERMISSIONS_REJECTED: 'permissions_rejected',
    THANK_YOU: 'thank_you',
};

export const Events = {
    NEXT: 'NEXT',
    ENABLE_PROTECTION: 'ENABLE_PROTECTION',
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

const showPinExtension = false; // isChrome || isEdge;

export const stateMachine = createMachine({
    id: 'onboarding-steps',
    initial: States.PROTECTION_LEVEL,
    context: {
        isChrome,
        isEdge,
        isFirefox,
        protectionEnabled,
    },
    states: {
        [States.SELECT_MODE]: {
            on: {
                [Events.ENABLE_PROTECTION]: {
                    actions: assign({ protectionEnabled: true }),
                    target: States.SELECT_MODE,
                },
                [Events.DISABLE_PROTECTION]: {
                    actions: assign({ protectionEnabled: false }),
                    target: States.SELECT_MODE,
                },
                [Events.NEXT]: [{
                    target: States.REQUEST_PERMISSIONS,
                    cond: (context) => context.protectionEnabled,
                }, {
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
                [Events.REJECT_PERMISSIONS]: States.SELECT_MODE,
                [Events.PERMISSIONS_ALREADY_GRANTED]: States.THANK_YOU,
                [Events.PREVIOUS]: States.SELECT_MODE,
            },
            meta: {
            },
        },
        //
        [States.PROTECTION_LEVEL]: {
            on: {
                [Events.NEXT]: showPinExtension ? States.PIN_EXTENSION : States.TELEMETRY,
                [Events.PREVIOUS]: States.REQUEST_PERMISSIONS,
            },
            meta: {
            },
        },
        //
        [States.PIN_EXTENSION]: {
            on: {
                [Events.NEXT]: States.TELEMETRY,
                [Events.PREVIOUS]: States.PROTECTION_LEVEL,
            },
            meta: {
                skip: !showPinExtension,
            },
        },
        //
        [States.TELEMETRY]: {
            on: {
                [Events.NEXT]: States.THANK_YOU,
                // eslint-disable-next-line max-len
                [Events.PREVIOUS]: showPinExtension ? States.PIN_EXTENSION : States.PROTECTION_LEVEL,
            },
            meta: {
            },
        },
        //
        [States.THANK_YOU]: {
            type: 'final',
            meta: {
                skip: true,
            },
        },
    },
});
