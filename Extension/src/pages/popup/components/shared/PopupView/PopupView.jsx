import {
    Box, Flex, IconArrowLeftLine, Text,
} from '@qwant/qwant-ponents';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { t } from '~src/common/translators/reactTranslator';

import Styles from './PopupView.module.scss';

export const PopupView = ({
    title,
    subtitle,
    children,
}) => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate('/main');
    };

    return (
        <Box p="s">
            <Text typo="body-2" color="primary" raw>
                <Flex alignCenter mb="s" as="button" onClick={goBack} className={Styles.PopupViewBack}>
                    <IconArrowLeftLine width={24} height={24} />
                    {t('back')}
                </Flex>
            </Text>
            <Text bold typo="heading-5" as="h1">
                {title}
            </Text>
            {subtitle && (
                <div className="subtitle">
                    {subtitle}
                </div>
            )}
            {children}
        </Box>
    );
};
