import React, { useMemo } from 'react';
import { t } from '~src/common/translators/reactTranslator';
import { IconShield, IconTime } from '~src/pages/popup/components/shared/Icons';
import { Tile } from '~src/pages/popup/components/shared/Tile/Tile';
import { ThinCardLink } from '~src/pages/popup/components/shared/ThinCardLink/ThinCardLink';
import { useNavigate } from 'react-router-dom';
import { formatAnnoyanceTime, formatCounter } from '../../../helpers';
import Styles from './GlobalStats.module.scss';

export const GlobalStats = ({
    showGlobalStats,
    totalBlocked,
}) => {
    const navigate = useNavigate();
    const annoyanceTime = useMemo(() => formatAnnoyanceTime(totalBlocked), [totalBlocked]);

    if (!showGlobalStats) {
        return <ThinCardLink title={t('global_stats')} label={t('global_stats_disabled_short')} onClick={() => navigate('/global-stats')} />;
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
