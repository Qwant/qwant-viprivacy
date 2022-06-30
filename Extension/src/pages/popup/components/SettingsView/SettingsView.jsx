import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import { messenger } from '~src/pages/services/messenger';
import { reactTranslator } from '~src/common/translators/reactTranslator';

import { Stack, Text } from '@qwant/qwant-ponents';
import { CheckboxCard } from '~src/pages/common/components/CheckboxCard/CheckboxCard';

const SettingsView = observer(({ store, settingsStore }) => {
    const { applicationFilteringDisabled } = store;
    const { protectionLevel } = settingsStore;

    const [activeLevel, setActiveLevel] = useState(() => {
        if (applicationFilteringDisabled) return 'disabled';
        return protectionLevel;
    });

    useEffect(() => {
        if (!activeLevel && !!protectionLevel) {
            setActiveLevel(protectionLevel);
        }
    }, [activeLevel, protectionLevel]);

    const onProtectionDisable = async () => {
        await store.changeApplicationFilteringDisabled(!applicationFilteringDisabled);
    };

    const levelChangeHandler = (level) => async (e) => {
        e.preventDefault();
        const transaction = window?.apm?.startTransaction(`protection-button-click-${level}`);
        setActiveLevel(level);
        if (level === 'disabled') {
            await onProtectionDisable();
            return;
        }

        await store.changeApplicationFilteringDisabled(false);

        messenger.changeProtectionLevel(level);
        settingsStore.setProtectionLevel(level);

        if (transaction) {
            transaction.result = 'success';
            transaction.end();
        }
    };

    const levels = ['standard', 'strict', 'disabled'];

    return (
        <Stack gap="s">
            <Text typo="heading-5" bold color="primary" as="h1">
                {reactTranslator.getMessage('protection_level')}
            </Text>
            <Stack gap="xs">
                {levels.map((level) => (
                    <CheckboxCard
                        compact
                        key={level}
                        title={reactTranslator.getMessage(`protection_level_${level}`)}
                        description={reactTranslator.getMessage(`protection_level_${level}_description`)}
                        onClick={levelChangeHandler(level)}
                        selected={activeLevel === level}
                    />
                ))}
            </Stack>
        </Stack>
    );
});

export default SettingsView;
