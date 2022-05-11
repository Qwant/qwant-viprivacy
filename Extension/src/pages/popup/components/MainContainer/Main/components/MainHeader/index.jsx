import React from 'react';
import { useNavigate } from 'react-router-dom';
import { browser } from '../../../../../../../background/extension-api/browser';
import { QwantLogo } from '../../../components/QwantLogo';
import { SettingsIcon } from './SettingsIcon';

import './styles.css';

const QWANT_URL = 'https://qwant.com';

export const MainHeader = ({ isReady, showSettings }) => {
    const navigate = useNavigate();
    const openTab = (url) => {
        browser.tabs.create({ active: true, url });
    };

    const goToSettings = () => {
        navigate('/settings');
    };

    return (
        <div className="main__header">
            <div
                tabIndex="0"
                role="button"
                className="logo"
                onClick={() => openTab(QWANT_URL)}
                onKeyPress={() => openTab(QWANT_URL)}
            >
                <QwantLogo />
            </div>
            {isReady && showSettings && (
                <div
                    tabIndex="0"
                    role="button"
                    className="settings"
                    onClick={goToSettings}
                    onKeyPress={goToSettings}
                >
                    <SettingsIcon />
                </div>
            )}
        </div>
    );
};
