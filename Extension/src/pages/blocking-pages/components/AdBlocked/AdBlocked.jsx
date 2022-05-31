/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useCallback } from 'react';
import { reactTranslator } from '../../../../common/translators/reactTranslator';

import { MESSAGE_TYPES } from '../../../../common/constants';
import { getParams } from '../../getParams';
import { messenger } from '../../../services/messenger';
import { Button } from '../../../common/components/Button';
import { Header } from '../../../options/OnboardingPage/components/Header';
import QwantLogoSquare from './assets/qwant_logo_square.png';

import '../../../popup/components/Popup/main.css';
import './style.css';

export const AdBlocked = () => {
    const { url } = getParams();

    const handleGoBack = useCallback((e) => {
        e.preventDefault();
        window.history.back();
    }, []);

    const handleProceed = useCallback((e) => {
        e.preventDefault();
        messenger.sendMessage(MESSAGE_TYPES.ADD_URL_TO_TRUSTED, { url });
    }, [url]);

    return (
        <div>
            <Header />
            <div className="wrapper">
                <div className="content">
                    <img alt="" src={QwantLogoSquare} className="qwant_logo" />

                    <div className="content_text">
                        <div className="content_text_title">
                            {reactTranslator.getMessage('blocking_pages_rule_content_title', {
                                name: reactTranslator.getMessage('short_name'),
                            })}
                        </div>
                        <div className="content_text_url">
                            <code>
                                {url}
                            </code>
                        </div>
                        <div className="content_text_description">
                            {reactTranslator.getMessage('blocking_pages_rule_content_description', {
                                name: reactTranslator.getMessage('short_name'),
                            })}
                        </div>

                    </div>

                    <div className="alert__buttons">
                        <Button color="secondary" onClick={handleGoBack}>
                            {reactTranslator.getMessage('back')}
                        </Button>

                        <Button color="primary" onClick={handleProceed}>
                            {reactTranslator.getMessage('blocking_pages_btn_proceed')}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};
