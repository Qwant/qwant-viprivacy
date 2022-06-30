import React from 'react';

import './styles.css';
import { QwantLogo } from '~src/pages/common/components/QwantLogo/QwantLogo';

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
