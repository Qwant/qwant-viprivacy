import {
    Flex, IconArrowLeftLine, Text, Box,
} from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';
import { useLocation, useNavigate } from 'react-router-dom';
import { QwantLogo } from '~src/pages/common/components/QwantLogo/QwantLogo';
import React from 'react';
import { browserUtils } from '~src/background/utils/browser-utils';
import Styles from './Popup.module.scss';
import { IconSearch } from './shared/Icons';
import { urls } from '../../helpers';

const MainHeaderMobile = () => {
    const onClose = () => {
        window.close();
    };

    return (
        <Box px="s" py="xs">
            <Flex alignCenter className={Styles.BackButtonMobile}>
                <Box as="button" onClick={onClose}>
                    <IconArrowLeftLine width={24} height={24} />
                </Box>
                <QwantLogo withSquare height={40} />
            </Flex>
        </Box>
    );
};

export function PopupHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/main') {
        if (browserUtils.isMobileQwant()) {
            return <MainHeaderMobile />;
        }

        return (
            <Flex between alignCenter mb="s">
                <QwantLogo withSquare height={44} width={224} />
                <Text
                    typo="heading-3"
                    as="a"
                    color="primary"
                    href={urls.qwant()}
                    target="_blank"
                    rel="noreferrer"
                    className={Styles.PopupSearch}
                >
                    <IconSearch />
                </Text>
            </Flex>
        );
    }

    return (
        <Box pt="s" px="s">
            <Text typo="body-2" color="primary" raw>
                <Flex alignCenter mb="s" as="button" onClick={() => navigate('/main')} className={Styles.PopupBack}>
                    <IconArrowLeftLine width={24} height={24} />
                    {t('back')}
                </Flex>
            </Text>
        </Box>
    );
}
