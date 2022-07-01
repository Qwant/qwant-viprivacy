import React, { useMemo } from 'react';
import { t } from '~src/common/translators/reactTranslator';
import { IconShield, IconTime } from '~src/pages/popup/components/shared/Icons';
import { Tile } from '~src/pages/popup/components/shared/Tile/Tile';
import { formatAnnoyanceTime, formatCounter } from '../../../helpers';
import Styles from './GlobalStats.module.scss';

export const GlobalStats = ({
    showGlobalStats,
    totalBlocked,
}) => {
    const annoyanceTime = useMemo(() => formatAnnoyanceTime(totalBlocked), [totalBlocked]);

    if (!showGlobalStats) {
        return null;
    }

    const items = [{
        label: t('popup_stats_blocked_trackers'),
        value: formatCounter(totalBlocked),
        icon: IconShield,
    }, {
        label: t('popup_stats_time_saved'),
        value: annoyanceTime,
        icon: IconTime,
    }];

    return (
        <div className={Styles.GlobalStats}>
            {items.map((item) => <Tile key={item.label} asCard color="purple" {...item} />)}
        </div>
    );
};
