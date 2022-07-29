import { Box, Text } from '@qwant/qwant-ponents';
import React from 'react';

import { t } from '~src/common/translators/reactTranslator';

import PermissionsRequestImage from './assets/permission-request.png';
import Styles from './Steps.module.scss';

export const StepPermissions = () => {
    return (
        <Box className={Styles.StepWithImage}>
            <Text bold typo="heading-3" color="primary" as="h1">
                {t('onboarding_step_request_permissions_title')}
            </Text>
            <Text raw typo="body-1" color="primary">
                <Box as="p" mt="m">
                    {t('onboarding_step_request_permissions_description')}
                </Box>
            </Text>
            <img src={PermissionsRequestImage} alt="" width="336" height="354" />
        </Box>
    );
};
