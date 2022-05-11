import React from 'react';
import { browser } from '../../../../../../background/extension-api/browser';
import { reactTranslator } from '../../../../../../common/translators/reactTranslator';
import { ArrowRight } from '../../components/Icons';

import './styles.css';

const helpLinks = [
    {
        text: 'popup_settings_help_know_more_label',
        url: 'popup_settings_help_know_more_link',
    },
    {
        text: 'popup_settings_help_new_label',
        url: 'popup_settings_help_new_link',
    }, {
        text: 'popup_settings_help_feedback_label',
        url: 'popup_settings_help_feedback_link',
    },
];

const HelpLink = ({
    url, text,
}) => {
    const openTab = () => {
        browser.tabs.create({ url: reactTranslator.getMessage(url), active: true });
    };

    return (
        <a
            onClick={openTab}
            href={reactTranslator.getMessage(url)}
            title={reactTranslator.getMessage(text)}
        >
            <span>{reactTranslator.getMessage(text)}</span>
            <ArrowRight className="chevron" />
        </a>
    );
};

export const HelpSection = () => {
    return (
        <div className="help-section">
            <div className="title">{reactTranslator.getMessage('popup_settings_help_label')}</div>

            <div className="help-links">
                {helpLinks.map((link) => (
                    <HelpLink {...link} key={link.url} />
                ))}
            </div>
        </div>
    );
};
