import { Flex, IconArrowRightSLine, Text } from '@qwant/qwant-ponents';
import React from 'react';

import { ThinCard } from '~src/pages/common/components/ThinCard/ThinCard';

import Styles from './ThinCardLink.module.scss';

/**
 * @param {(MouseEvent) => void} onClick
 * @param {string} title
 * @param {string} label
 */
export function ThinCardLink({ onClick, title, label }) {
    return (
        <ThinCard p="s" onClick={onClick} as="button" className={Styles.ThinCardLink}>
            <Flex between alignCenter>
                <Text bold typo="body-2" color="primary">
                    {title}
                </Text>
                <Text typo="heading-5" color="primary">
                    <Flex alignCenter>
                        <Text typo="body-2" color="primary">
                            {label}
                        </Text>
                        <IconArrowRightSLine />
                    </Flex>
                </Text>
            </Flex>
        </ThinCard>
    );
}
