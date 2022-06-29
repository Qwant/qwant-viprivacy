import React from 'react';
import { Box, Text } from '@qwant/qwant-ponents';
import { reactTranslator } from '~src/common/translators/reactTranslator';
import PermissionsRequestImage from './assets/permission-request.svg';
import Styles from './Steps.module.scss';

export const StepPermissions = () => {
    return (
        <Box className={Styles.StepWithImage}>
            <Text bold typo="heading-3" color="primary" as="h1">
                {reactTranslator.getMessage('onboarding_step_request_permissions_title')}
            </Text>
            <Text raw typo="body-1" color="primary">
                <Box as="p" mt="m">
                    {reactTranslator.getMessage('onboarding_step_request_permissions_description')}
                </Box>
            </Text>
            <img src={PermissionsRequestImage} alt="" width="312" height="204" />
        </Box>
    );
};
