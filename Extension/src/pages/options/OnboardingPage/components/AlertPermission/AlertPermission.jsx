import React from 'react';
import { Alert, Text } from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';
import Styles from './AlertPermission.module.scss';

export function AlertPermission({ onClose }) {
    return (
        <Alert type="error" fixed className={Styles.AlertPermission} onClose={onClose}>
            <Text typo="body-2" bold>
                {t('onboarding_step_alert_permission_title')}
            </Text>
            <Text typo="body-2">
                {t('onboarding_step_alert_permission_description')}
            </Text>
        </Alert>
    );
}
