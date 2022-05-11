import React from 'react';
import { reactTranslator } from '../../../../../../../common/translators/reactTranslator';
import { ArrowRight } from '../../../components/Icons';
import { formatAnnoyanceTime, formatCounter } from '../../../helpers';
import { Section } from '../Section';

import './styles.css';

export const GlobalStats = ({
    totalBlocked,
    onClick,
}) => {
    const annoyanceTime = React.useMemo(() => formatAnnoyanceTime(totalBlocked), [totalBlocked]);

    return (
        <div className="global_stats__section">
            <Section
                onClick={onClick}
                background="#fff"
                size="small"
                title={reactTranslator.getMessage('global_stats')}
            >
                <div className="global_stats__bottom">
                    <div className="global_stats__container">
                        <div className="left">
                            <div>{reactTranslator.getMessage('popup_stats_blocked_trackers')}</div>
                            <div className="metric">{formatCounter(totalBlocked)}</div>
                        </div>

                        <div className="right">
                            <div>{reactTranslator.getMessage('popup_stats_time_saved')}</div>
                            <div className="metric">
                                {annoyanceTime}
                            </div>
                        </div>
                    </div>
                    <ArrowRight />
                </div>
            </Section>
        </div>
    );
};
