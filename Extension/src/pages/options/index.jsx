import React from 'react';
import ReactDOM from 'react-dom';
import { OnboardingPage } from './OnboardingPage';

import { i18n } from '../../common/translators/i18n';
import { reactTranslator } from '../../common/translators/reactTranslator';
import '@qwant/qwant-ponents/src/base.scss';

export const optionsPage = {
    init: () => {
        document.title = reactTranslator.getMessage('name');
        document.documentElement.lang = i18n.getUILanguage();

        ReactDOM.render(
            <OnboardingPage />,
            document.getElementById('root'),
        );
    },
};
