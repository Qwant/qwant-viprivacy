import React, { useMemo } from 'react';
import { ThinCard } from '~src/pages/common/components/ThinCard/ThinCard';
import { t } from '~src/common/translators/reactTranslator';
import { useNavigate } from 'react-router-dom';
import { RiLineChartLine as IconChart } from 'react-icons/ri';
import {
    Flex, IconInfoCircle, IconExternalLink, Text,
} from '@qwant/qwant-ponents';
import Styles from './MainLinks.module.scss';

export function MainLinks({ withStats }) {
    const navigate = useNavigate();
    const links = useMemo(() => [...(withStats ? [{
        label: t('stats'),
        to: () => navigate('/global-stats'),
        icon: IconChart,
    }] : []), {
        label: t('infos'),
        to: () => navigate('/about'),
        icon: IconInfoCircle,
    }, {
        label: t('survey'),
        to: t('survey_url'),
        icon: IconExternalLink,
    }], [navigate, withStats]);

    return (
        <ThinCard className={Styles.MainLinks}>
            {links.map((l) => <Link key={l.label} {...l} />)}
        </ThinCard>
    );
}

function Link({
    label,
    to,
    icon: IconComponent,
}) {
    const isAnchor = typeof to === 'string';
    if (isAnchor) {
        return (
            <Flex
                as="a"
                target="_blank"
                rel="noreferrer"
                alignCenter
                center
                href={to}
            >
                <IconComponent />
                <Text typo="body-2">
                    {label}
                </Text>
            </Flex>
        );
    }

    return (
        <Flex as="button" alignCenter center onClick={to}>
            <IconComponent />
            <Text typo="body-2">
                {label}
            </Text>
        </Flex>
    );
}
