import React from 'react';
import { t } from '~src/common/translators/reactTranslator';

import { ThinCard } from '~src/pages/common/components/ThinCard/ThinCard';
import { Flex, IconArrowRightSLine, Text } from '@qwant/qwant-ponents';
import Styles from './ProtectionLevel.module.scss';

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

    return (
        <ThinCard p="s" onClick={onClick} as="button" className={Styles.ProtectionLevel}>
            <Flex between alignCenter>
                <Text bold typo="body-2" color="primary">
                    {t('protection_level')}
                </Text>
                <Text typo="heading-5" color="primary">
                    <Flex alignCenter>
                        <Text typo="body-2" color="primary">
                            {level ? t(`protection_level_${level}`) : ''}
                        </Text>
                        <IconArrowRightSLine />
                    </Flex>
                </Text>
            </Flex>
        </ThinCard>
    );
};
