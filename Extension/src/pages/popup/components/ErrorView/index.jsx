/* eslint-disable max-len */
import React from 'react';
import { observer } from 'mobx-react';

import './styles.css';
import { browser } from '~src/background/extension-api/browser';
import { reactTranslator } from '~src/common/translators/reactTranslator';
import { Button } from '../../../common/components/Button';

const ErrorView = observer(({ error }) => {
    const onReload = () => {
        browser.runtime.reload();
    };

    const message = error?.message || 'Unknown error';

    return (
        <div className="main">
            <div className="error__content">
                <div className="error__message">
                    <b>{reactTranslator.getMessage('error_label')}</b>
                    {` ${message}`}
                </div>

                <Button
                    color="secondary"
                    onClick={onReload}
                    className="section-loading_button"
                >
                    {reactTranslator.getMessage('loading_reload_cta')}
                </Button>
            </div>
        </div>
    );
});

export default ErrorView;
