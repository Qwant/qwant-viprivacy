import {
    Flex, IconArrowLeftLine, Text, Box,
} from '@qwant/qwant-ponents';
import { RiArrowLeftSLine as IconArrowLeft } from 'react-icons/ri';
import { t } from '~src/common/translators/reactTranslator';
import { useLocation, useNavigate } from 'react-router-dom';
import { QwantLogo } from '~src/pages/common/components/QwantLogo/QwantLogo';
import React from 'react';
import browser from 'webextension-polyfill';
import Styles from './Popup.module.scss';
import { IconSearch } from './shared/Icons';
import { urls } from '../../helpers';

const { optional_permissions: optionalPermissions } = browser.runtime.getManifest();
const isMobile = optionalPermissions == null || optionalPermissions?.length === 0;

const MainHeaderMobile = () => {
    const onClose = () => {
        window.close();
    };

    return (
        <Box px="s" pt="xs" className={Styles.MainHeaderMobile}>
            <Flex between alignCenter takeAvailableSpace>
                <Text typo="heading-1" color="primary" onClick={onClose} className={Styles.BackButtonMobile}>
                    <IconArrowLeft />
                </Text>
                <QwantLogo height={24} width={185} />
            </Flex>
        </Box>
    );
};

export function PopupHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/main') {
        if (isMobile) {
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
