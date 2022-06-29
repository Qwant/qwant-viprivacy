import React from 'react';
import { Alert, Text } from '@qwant/qwant-ponents';
import { reactTranslator } from '~src/common/translators/reactTranslator';
import Styles from './AlertPermission.module.scss';

export function AlertPermission({ onClose }) {
    return (
        <Alert type="error" fixed className={Styles.AlertPermission} onClose={onClose}>
            <Text typo="body-2" bold>
                {reactTranslator.getMessage('onboarding_step_alert_permission_title')}
            </Text>
            <Text typo="body-2">
                {reactTranslator.getMessage('onboarding_step_alert_permission_description')}
            </Text>
        </Alert>
    );
}
