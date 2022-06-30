import React from 'react';
import { t } from '../../../../../common/translators/reactTranslator';
import { formatAnnoyanceTime, formatCounter } from '../../../helpers';
import { Section } from '../Section';

import './styles.css';

export const GlobalStats = ({
    showGlobalStats,
    totalBlocked,
    onClick,
}) => {
    const annoyanceTime = React.useMemo(() => formatAnnoyanceTime(totalBlocked), [totalBlocked]);

    return (
        <div className="global_stats__section">
            <Section
                onClick={onClick}
                background="~src/pages/popup/components/MainView/GlobalStats/index#fff"
                size="small"
                title={t('global_stats')}
            >
                <div className="global_stats__bottom">
                    <div className="global_stats__container">
                        {showGlobalStats ? (
                            <>
                                <div className="left">
                                    <div>{t('popup_stats_blocked_trackers')}</div>
                                    <div className="metric">{formatCounter(totalBlocked)}</div>
                                </div>

                                <div className="right">
                                    <div>{t('popup_stats_time_saved')}</div>
                                    <div className="metric">
                                        {annoyanceTime}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    {/* TODO */}
                                    Global stats disabled
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Section>
        </div>
    );
};
