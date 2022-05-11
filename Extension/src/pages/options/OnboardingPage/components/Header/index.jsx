import React from 'react';
import { QwantLogo } from '../../../../popup/components/MainContainer/components/QwantLogo';

import './styles.css';

export const Header = () => {
    return (
        <div className="navbar">
            <div>
                <a name="qwant-logo-link" href="https://qwant.com" target="_blank" rel="noreferrer">
                    <QwantLogo />
                </a>
            </div>
        </div>
    );
};
