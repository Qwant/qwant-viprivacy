import React from 'react';
import { Header } from './Header';
import './styles.css';

export const PopupView = ({
    goToMain, title, subtitle, children,
}) => {
    return (
        <div className="popup_view_container">
            <Header goToMain={goToMain} />
            <div className="title">
                {title}
            </div>
            {subtitle && (
                <div className="subtitle">
                    {subtitle}
                </div>
            )}
            {children}
        </div>
    );
};
