import React from 'react';
import { useNavigate } from 'react-router-dom';
import { reactTranslator } from '../../../../../../../common/translators/reactTranslator';

import './styles.css';

const ArrowBack = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path d="M0 0h32v32H0z" />
            <path d="M13.821 24.293a1 1 0 1 1-1.414 1.414l-7.724-7.724a2.333 2.333 0 0 1 0-3.3l7.724-7.723a1 1 0 0 1 1.414 1.414l-6.96 6.96h19.587a1 1 0 0 1 0 2H6.862l6.96 6.959z" fill="#050506" />
        </g>
    </svg>
);

const BackButton = () => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate('/main');
    };

    return (
        <button type="button" className="back-btn" onClick={onClick}>
            <ArrowBack />
            <span className="back-btn__text">{reactTranslator.getMessage('back')}</span>
        </button>
    );
};

export const Header = () => {
    return (
        <div className="header">
            <BackButton />
        </div>
    );
};
