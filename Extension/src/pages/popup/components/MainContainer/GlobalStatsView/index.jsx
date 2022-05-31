import React from 'react';
import { observer } from 'mobx-react';

import { Table } from '../components/Table';
import { Tile } from '../components/Tile';

import { reactTranslator } from '../../../../../common/translators/reactTranslator';

import { formatAnnoyanceTime, formatCounter } from '../helpers';

import './styles.css';
import { PopupView } from '../components/PopupView';
import { Clock, Shield } from '../components/Icons';
import { useKonamiCode } from './useKonami';

const GlobalStatsView = observer(({ store }) => {
    const [isKonami] = useKonamiCode();

    const annoyanceTime = React.useMemo(() => formatAnnoyanceTime(store.totalBlocked),
        [store.totalBlocked]);

    const domains = store.blockedDomains?.total?.domains || [];
    const domainsStr = JSON.stringify(store.blockedDomains);

    React.useEffect(() => {
        try {
            if (isKonami && navigator && navigator.clipboard) {
                navigator.clipboard.writeText(domainsStr);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    }, [isKonami, domainsStr]);

    const list = Object.keys(domains).map((domain) => (
        { domain, count: domains[domain] }
    )).sort((a, b) => b.count - a.count).slice(0, 8);

    const title = reactTranslator.getMessage('global_stats');

    return (
        <PopupView title={title}>
            <div className="global_stats_container">
                <div className="tiles">
                    <Tile
                        icon={<Shield />}
                        label={reactTranslator.getMessage('popup_stats_trackers')}
                        value={formatCounter(store.totalBlocked)}
                        background="#ded6ff"
                    />
                    <Tile
                        icon={<Clock />}
                        label={reactTranslator.getMessage('popup_stats_time_saved')}
                        value={annoyanceTime}
                        background="#ded6ff"
                    />
                </div>
                <Table list={list} />
            </div>
        </PopupView>
    );
});

export default GlobalStatsView;
