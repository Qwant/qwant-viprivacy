import React from 'react';
import { Card, Stack, Text } from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';
import Styles from './UpsellMobile.module.scss';
import ButtonAndroid from '../assets/buttons-apps-google-negative.svg';
import ButtonIOS from '../assets/buttons-apps-apple-negative.svg';
import QRCode from '../assets/qr-code.svg';

export function UpsellMobile() {
    return (
        <Card className={Styles.UpsellMobile} p="xl">
            <div className={Styles.LeftImage}>
                <img src="https://place-hold.it/220x220" alt="" />
            </div>
            <Stack gap="m">
                <Text typo="heading-5" color="primary" bold>
                    {t('upsell_mobile_title')}
                </Text>
                <Stack horizontal gap="xs">
                    <a target="_blank" rel="noreferrer" href="https://play.google.com/store/apps/details?id=com.qwant.liberty">
                        <img src={ButtonAndroid} alt="" />
                    </a>
                    <a target="_blank" rel="noreferrer" href="https://apps.apple.com/fr/app/qwant/id924470452">
                        <img src={ButtonIOS} alt="" />
                    </a>
                </Stack>
            </Stack>
            <Stack p="xs" gap="xs" className={Styles.UpsellMobileQRCode}>
                <img src={QRCode} alt="" />
                <Text center typo="body-2" color="primary" bold>
                    {t('upsell_mobile_qrcode')}
                </Text>
            </Stack>
        </Card>
    );
}
