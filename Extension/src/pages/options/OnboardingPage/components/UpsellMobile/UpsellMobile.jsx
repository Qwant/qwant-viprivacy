import React from 'react';
import { Card, Stack, Text } from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';
import Styles from './UpsellMobile.module.scss';
import QRCode from '../assets/qr-code.png';

import { ButtonDlApp } from './ButtonDlApp';

export function UpsellMobile() {
    return (
        <Card className={Styles.UpsellMobile} p="xl">
            <div className={Styles.LeftImage}>
                <img src="https://place-hold.it/196x196" alt="" />
            </div>
            <Stack gap="m">
                <Text typo="heading-5" color="primary" bold>
                    {t('upsell_mobile_title')}
                </Text>
                <Stack horizontal gap="xs">
                    <ButtonDlApp />
                    <ButtonDlApp isIos />
                </Stack>
            </Stack>
            <Stack p="xs" gap="xs" className={Styles.UpsellMobileQRCode}>
                {/* TODO replace with qwant-ponents QR code */}
                <img src={QRCode} alt="" width="88" height="88" />
                <Text center typo="body-2" color="primary" bold>
                    {t('upsell_mobile_qrcode')}
                </Text>
            </Stack>
        </Card>
    );
}
