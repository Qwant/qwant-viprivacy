import React from 'react';
import Switch from 'react-switch';

import { Events, States } from '../../stateMachine';

import PinExtensionImage from './assets/pin-extension.png';
import PermissionsRequestImage from './assets/permissions-request.png';

import { reactTranslator } from '../../../../../common/translators/reactTranslator';
import { Image } from '../Image';

import { ProtectionButton } from '../../../../popup/components/MainContainer/components/ProtectionButton';
import { PermissionsMissing } from '../../../../popup/components/MainContainer/Main/PermissionsMissing';
import { Stepper } from './Stepper';

import './styles.css';
import { Button } from '../../../../common/components/Button';
import { ArrowImage } from './assets/Arrow';

const ASSETS_BASE_URL = 'https://extension-assets-prod.cellar-c2.services.clever-cloud.com';

export const Steps = ({
    isLoading, state, send, updateProtectionLevel,
    protectionLevel, disableCollectHit, updateTelemetry,
    onForward, onBack,
}) => {
    const step = state.value;

    return (
        <div className="steps">
            <Title step={step} context={state.context} />

            <div className="content">
                <Content
                    send={send}
                    state={state}
                    isLoading={isLoading}
                    updateProtectionLevel={updateProtectionLevel}
                    protectionLevel={protectionLevel}
                    updateTelemetry={updateTelemetry}
                    disableCollectHit={disableCollectHit}
                    onForward={onForward}
                />
            </div>

            <Stepper
                state={state}
                send={send}
                onForward={onForward}
                onBack={onBack}
                isLoading={isLoading}
            />
        </div>
    );
};

const Title = ({ step, context }) => {
    const { title, description } = getText({ step, context });

    if (!title) return null;

    return (
        <div className="title">
            <div>
                <h1>{title}</h1>
                <div className="description">
                    {description}
                </div>
            </div>
        </div>
    );
};

const browserName = ({
    isChrome,
    isEdge,
    isFirefox,
}) => {
    if (isChrome) return '"Chrome"';
    if (isEdge) return '"Edge"';
    if (isFirefox) return '"Firefox"';
    return reactTranslator.getMessage('your_browser');
};

const getText = ({ step, context }) => {
    switch (step) {
        case States.REQUEST_PERMISSIONS:
        case States.PROTECTION_LEVEL:
        case States.PIN_EXTENSION:
        case States.TELEMETRY:
        case States.PERMISSIONS_REJECTED: {
            return {
                title: reactTranslator.getMessage(`onboarding_step_${step}_title`, {
                    browser: browserName(context),
                }),
                description: reactTranslator.getMessage(`onboarding_step_${step}_description`),
            };
        }
        default:
            return {
                title: '',
                description: '',
            };
    }
};

const Content = ({
    state, updateProtectionLevel, send,
    protectionLevel, disableCollectHit, updateTelemetry, onForward,
}) => {
    switch (state.value) {
        case States.REQUEST_PERMISSIONS:
            return <RequestPermissions />;
        case States.PROTECTION_LEVEL:
            return (
                <ProtectionLevels
                    protectionLevel={protectionLevel}
                    updateProtectionLevel={updateProtectionLevel}
                />
            );
        case States.PIN_EXTENSION:
            return <PinExtension />;
        case States.TELEMETRY:
            return (
                <Telemetry
                    disableCollectHit={disableCollectHit}
                    updateTelemetry={updateTelemetry}
                />
            );
        case States.PERMISSIONS_REJECTED:
            return <PermissionsRejected send={send} />;
        case States.THANK_YOU:
            return <ThankYou onForward={onForward} />;
        default:
            return null;
    }
};

const RequestPermissions = () => {
    return (
        <div>
            <Image
                src={`${ASSETS_BASE_URL}/permissions-request.png`}
                srcFallback={PermissionsRequestImage}
                className="content-image"
            />
        </div>
    );
};

const PermissionsRejected = ({ send }) => {
    const onRequestPermissions = () => {
        send(Events.GO_TO_REQUEST_PERMISSIONS);
    };
    return (
        <div>
            <div className="subtitle">
                {reactTranslator.getMessage('onboarding_step_permissions_rejected_subtitle')}
            </div>
            <PermissionsMissing inlineCTA onRequestPermissions={onRequestPermissions} />
        </div>
    );
};

const ThankYou = ({ onForward }) => {
    return (
        <div>
            <div className="thank_you_arrow">
                <ArrowImage />
            </div>

            <div className="title">
                <div>
                    <h1>
                        {reactTranslator.getMessage('onboarding_step_thank_you_title')}
                    </h1>
                    <br />
                    <Button className="thank_you_fwd_btn" color="primary" onClick={onForward} name="btn-forward_thank_you">
                        {reactTranslator.getMessage('onboarding_stepper_lets_go')}
                    </Button>
                </div>
            </div>

        </div>
    );
};

const PinExtension = () => (
    <div>
        <Image className="content-image" src={`${ASSETS_BASE_URL}/pin-extension.png`} srcFallback={PinExtensionImage} />
    </div>
);

const ProtectionLevels = ({ protectionLevel, updateProtectionLevel }) => {
    return (
        <div>
            <ProtectionButton
                level="standard"
                active={protectionLevel === 'standard'}
                onClick={updateProtectionLevel}
            />
            <ProtectionButton
                level="strict"
                active={protectionLevel === 'strict'}
                onClick={updateProtectionLevel}
            />
        </div>
    );
};

const Telemetry = ({ disableCollectHit, updateTelemetry }) => {
    const onChange = (enabled) => {
        updateTelemetry(enabled);
    };
    return (
        <div className="telemetry-wrapper">
            <div className="telemetry_title">
                {reactTranslator.getMessage('onboarding_step_telemetry_section_title')}
            </div>

            <Switch
                width={28}
                height={16}
                handleDiameter={12}
                uncheckedIcon={false}
                checkedIcon={false}
                onColor="#1a6aff"
                offColor="#c4c4cc"
                onChange={onChange}
                onKeyUp={onChange}
                checked={!disableCollectHit}
            />
        </div>
    );
};
