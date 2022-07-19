import {
    Flex, IconArrowLeftLine, Text,
} from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';
import { useLocation, useNavigate } from 'react-router-dom';
import { QwantLogo } from '~src/pages/common/components/QwantLogo/QwantLogo';
import React from 'react';
import Styles from './Popup.module.scss';
import { IconSearch } from './shared/Icons';
import { urls } from '../../helpers';

export function PopupHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/main') {
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
        <Text typo="body-2" color="primary" raw>
            <Flex alignCenter mb="s" as="button" onClick={() => navigate('/main')} className={Styles.PopupBack}>
                <IconArrowLeftLine width={24} height={24} />
                {t('back')}
            </Flex>
        </Text>
    );
}
