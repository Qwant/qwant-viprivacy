/* eslint-disable max-len */
import React from 'react';
import { observer } from 'mobx-react';

import './styles.css';
import { browser } from '~src/background/extension-api/browser';
import { t } from '~src/common/translators/reactTranslator';
import { Button } from '@qwant/qwant-ponents';

const ErrorView = observer(({ error }) => {
    const onReload = () => {
        browser.runtime.reload();
    };

    const message = error?.message || 'Unknown error';

    return (
        <div className="main">
            <div className="error__content">
                <div className="error__message">
                    <b>{t('error_label')}</b>
                    {` ${message}`}
                </div>

                <Button
                    variant="secondary-black"
                    onClick={onReload}
                    className="section-loading_button"
                >
                    {t('loading_reload_cta')}
                </Button>
            </div>
        </div>
    );
});

export default ErrorView;
