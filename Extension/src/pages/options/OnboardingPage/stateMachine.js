import { createMachine } from 'xstate';
import { browserUtils } from '../../../background/utils/browser-utils';

export const States = {
    REQUEST_PERMISSIONS: 'request_permissions',
    PROTECTION_LEVEL: 'protection_level',
    PIN_EXTENSION: 'pin_extension',
    TELEMETRY: 'telemetry',
    PERMISSIONS_REJECTED: 'permissions_rejected',
    THANK_YOU: 'thank_you',
};

export const Events = {
    NEXT: 'NEXT',
    PREVIOUS: 'PREVIOUS',
    REJECT_PERMISSIONS: 'PERMISSIONS',
    PERMISSIONS_ALREADY_GRANTED: 'PERMISSIONS_ALREADY_GRANTED',
    GO_TO_REQUEST_PERMISSIONS: 'GO_TO_REQUEST_PERMISSIONS',
};

const isChrome = browserUtils.isChromeBrowser();
const isEdge = browserUtils.isEdgeChromiumBrowser();
const isFirefox = browserUtils.isFirefoxBrowser();

const showPinExtension = isChrome || isEdge;

export const stateMachine = createMachine({
    id: 'onboarding-steps',
    initial: States.REQUEST_PERMISSIONS,
    context: {
        isChrome,
        isEdge,
        isFirefox,
    },
    states: {
        [States.REQUEST_PERMISSIONS]: {
            on: {
                [Events.NEXT]: States.PROTECTION_LEVEL,
                [Events.REJECT_PERMISSIONS]: States.PERMISSIONS_REJECTED,
                [Events.PERMISSIONS_ALREADY_GRANTED]: States.THANK_YOU,
            },
            meta: {
            },
        },
        //
        [States.PROTECTION_LEVEL]: {
            on: {
                [Events.NEXT]: showPinExtension ? States.PIN_EXTENSION : States.TELEMETRY,
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
        //
        [States.PERMISSIONS_REJECTED]: {
            on: {
                [Events.NEXT]: States.REQUEST_PERMISSIONS,
                [Events.GO_TO_REQUEST_PERMISSIONS]: States.REQUEST_PERMISSIONS,
            },
            meta: {
                skip: true,
            },
        },
    },
});
