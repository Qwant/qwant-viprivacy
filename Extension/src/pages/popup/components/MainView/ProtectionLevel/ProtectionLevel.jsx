import React from 'react';

import { t } from '~src/common/translators/reactTranslator';
import { ThinCardLink } from '~src/pages/popup/components/shared/ThinCardLink/ThinCardLink';

const getProtectionLevel = ({
    protectionLevel,
    applicationFilteringDisabled,
}) => {
    if (applicationFilteringDisabled) return 'disabled';
    return protectionLevel;
};

export const ProtectionLevel = ({
    protectionLevel,
    applicationFilteringDisabled,
    onClick,
}) => {
    const level = getProtectionLevel({
        protectionLevel,
        applicationFilteringDisabled,
    });

    return <ThinCardLink title={t('protection_level')} label={level ? t(`protection_level_${level}`) : ''} onClick={onClick} />;
};
