import React from 'react';
import { browser } from '../../../../../../background/extension-api/browser';
import { reactTranslator } from '../../../../../../common/translators/reactTranslator';

import './styles.css';

export const TelemetrySection = ({
    checked,
    onChange,
}) => {
    const onLearnMore = (e) => {
        e.preventDefault();
        e.stopPropagation();

        browser.tabs.create({
            active: true,
            url: reactTranslator.getMessage(
                reactTranslator.getMessage('popup_settings_telemetry_learn_more_link'),
            ),
        });
    };

    return (
        <div className="telemetry-section">
            <input id="telemetry-check" type="checkbox" checked={checked} onChange={(e) => onChange(!e.target.checked)} />
            <label htmlFor="telemetry-check">
                {reactTranslator.getMessage('popup_settings_telemetry_label')}

                <a href={reactTranslator.getMessage('popup_settings_telemetry_learn_more_link')} onClick={onLearnMore}>
                    {reactTranslator.getMessage('popup_settings_telemetry_learn_more')}
                </a>
            </label>
        </div>

    );
};
