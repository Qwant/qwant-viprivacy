import React from 'react';
import ReactDOM from 'react-dom';
import { OnboardingPage } from './OnboardingPage';

import { i18n } from '../../common/translators/i18n';
import { reactTranslator } from '../../common/translators/reactTranslator';

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
