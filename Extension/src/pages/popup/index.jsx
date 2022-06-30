import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { i18n } from '../../common/translators/i18n';
import { Popup } from './components/Popup';

export const popupPage = {
    init: () => {
        document.documentElement.lang = i18n.getUILanguage();

        ReactDOM.render(
            <React.StrictMode>
                <MemoryRouter initialEntries={['/main']}>
                    <Popup />
                </MemoryRouter>
            </React.StrictMode>,
            document.getElementById('root'),
        );
    },
};
