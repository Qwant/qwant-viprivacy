import React from 'react';
import { reactTranslator } from '../../../../../../common/translators/reactTranslator';

import './styles.css';

export const TelemetrySection = ({
    checked,
    onChange,
}) => {
    return (
        <div className="telemetry-section">
            <input id="telemetry-check" type="checkbox" checked={checked} onChange={(e) => onChange(!e.target.checked)} />
            <label htmlFor="telemetry-check">
                {reactTranslator.getMessage('popup_settings_telemetry_label')}
            </label>
        </div>
    );
};
