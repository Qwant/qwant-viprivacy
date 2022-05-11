import React from 'react';
import { reactTranslator } from '../../../../../../../common/translators/reactTranslator';
import { ArrowRight } from '../../../components/Icons';
import { Section } from '../Section';

import './styles.css';

const getProtectionLevel = ({ protectionLevel, applicationFilteringDisabled }) => {
    if (applicationFilteringDisabled) return 'disabled';
    return protectionLevel;
};

export const ProtectionLevel = ({ protectionLevel, applicationFilteringDisabled, onClick }) => {
    const level = getProtectionLevel({
        protectionLevel, applicationFilteringDisabled,
    });

    return (
        <div className="protection_level__section">
            <Section
                onClick={onClick}
                background="#ded6ff"
                title={level ? reactTranslator.getMessage(`protection_level_${level}`) : ''}
                text={level ? reactTranslator.getMessage(`protection_level_${level}_description`) : ''}
            >
                <div className="protection_level__bottom">
                    <div>
                        <ShieldIcon />
                        {reactTranslator.getMessage('protection_level')}
                    </div>
                    <ArrowRight />
                </div>
            </Section>
        </div>
    );
};

const ShieldIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <rect fill="#050506" width="32" height="32" rx="16" />
            <path d="M4 4h24v24H4z" />
            <path d="m15.526 7.577-6 2A1.5 1.5 0 0 0 8.5 11v5.338c0 2.207 1.108 4.057 2.633 5.565 1.526 1.51 3.352 2.555 4.472 3.11a.876.876 0 0 0 .79 0c1.12-.555 2.946-1.6 4.472-3.11 1.524-1.508 2.633-3.358 2.633-5.565V11a1.5 1.5 0 0 0-1.026-1.423l-6-2a1.5 1.5 0 0 0-.948 0zm-6.475.577A3 3 0 0 0 7 11v5.338c0 5.502 5.56 8.841 7.94 10.019a2.377 2.377 0 0 0 2.12 0C19.44 25.179 25 21.84 25 16.337V11a3 3 0 0 0-2.051-2.846l-6-2a3 3 0 0 0-1.898 0l-6 2z" fill="#FFF" />
        </g>
    </svg>
);
