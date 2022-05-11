import React from 'react';
import { observer } from 'mobx-react';

import { messenger } from '../../../../services/messenger';
import { reactTranslator } from '../../../../../common/translators/reactTranslator';

import { PopupView } from '../components/PopupView';
import { ProtectionButton } from '../components/ProtectionButton';
import { HelpSection } from './HelpSection';
import { TelemetrySection } from './TelemetrySection';
import './styles.css';

const SettingsView = observer(({ store, settingsStore }) => {
    const { applicationFilteringDisabled } = store;
    const { settings, protectionLevel } = settingsStore;
    const key = settings?.names?.DISABLE_COLLECT_HITS;
    const disableCollectHit = key ? settings?.values[key] || false : false;

    const [activeLevel, setActiveLevel] = React.useState(() => {
        if (applicationFilteringDisabled) return 'disabled';
        return protectionLevel;
    });
    const [, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!activeLevel && !!protectionLevel) {
            setActiveLevel(protectionLevel);
        }
    }, [activeLevel, protectionLevel]);

    const onProtectionDisable = async () => {
        await store.changeApplicationFilteringDisabled(!applicationFilteringDisabled);
    };

    const onProtectionLevelChange = async (value) => {
        setActiveLevel(value);
        if (value === 'disabled') {
            await onProtectionDisable();
            return;
        }

        setLoading(true);

        await store.changeApplicationFilteringDisabled(false);

        messenger.changeProtectionLevel(value);
        settingsStore.setProtectionLevel(value);

        setLoading(false);
    };

    const onUpdateTelemetry = async (value) => {
        await messenger.changeUserSetting('hits-count-disabled', value);
        await settingsStore.requestOptionsData();
    };

    const title = reactTranslator.getMessage('protection_level');

    return (
        <PopupView title={title}>
            <div>

                <div className="protection-list">
                    <ProtectionButton
                        inPopup
                        level="standard"
                        active={activeLevel === 'standard'}
                        onClick={onProtectionLevelChange}
                    />
                    <ProtectionButton
                        inPopup
                        level="strict"
                        active={activeLevel === 'strict'}
                        onClick={onProtectionLevelChange}
                    />
                    <ProtectionButton
                        inPopup
                        level="disabled"
                        active={activeLevel === 'disabled'}
                        onClick={onProtectionLevelChange}
                    />
                </div>

                <HelpSection />

                <TelemetrySection
                    checked={!disableCollectHit}
                    onChange={onUpdateTelemetry}
                />

            </div>
        </PopupView>
    );
});

export default SettingsView;
