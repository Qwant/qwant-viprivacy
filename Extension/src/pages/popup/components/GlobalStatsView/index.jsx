import React from 'react';
import { observer } from 'mobx-react';

import { Table } from '../shared/Table/Table';
import { Tile } from '../shared/Tile/Tile';

import { reactTranslator } from '../../../../common/translators/reactTranslator';

import { formatAnnoyanceTime, formatCounter } from '../../helpers';

import './styles.css';
import { PopupView } from '../shared/PopupView/PopupView';
import { IconShield, IconTime } from '../shared/Icons';
import { useKonamiCode } from './useKonami';

const GlobalStatsView = observer(({ store }) => {
    const [isKonami] = useKonamiCode();

    const annoyanceTime = React.useMemo(() => formatAnnoyanceTime(store.totalBlocked),
        [store.totalBlocked]);

    const { showGlobalStats } = store;
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

    const toggleGlobalStats = () => {
        store.setShowGlobalStats(!showGlobalStats);
        if (showGlobalStats) {
            store.deleteBlockedDomains();
        }
    };

    const onDelete = () => {
        store.deleteBlockedDomains();
    };

    const title = reactTranslator.getMessage('global_stats');

    return (
        <PopupView title={title}>
            <div className="global_stats_container">
                <div className="tiles">
                    <Tile
                        icon={IconShield}
                        label={reactTranslator.getMessage('popup_stats_trackers')}
                        value={formatCounter(store.totalBlocked)}
                        color="purple"
                    />
                    <Tile
                        icon={IconTime}
                        label={reactTranslator.getMessage('popup_stats_time_saved')}
                        value={annoyanceTime}
                        color="purple"
                    />
                </div>
                <Table list={list} />

                <div>
                    Show Global stats:
                    {showGlobalStats?.toString() || 'undefined'}
                    <br />
                    <button type="button" onClick={toggleGlobalStats}>
                        {showGlobalStats ? 'Disable' : 'Enable'}
                        {' '}
                        global stats
                    </button>
                    <br />
                    <button type="button" onClick={onDelete}>
                        Delete
                    </button>

                </div>
            </div>
        </PopupView>
    );
});

export default GlobalStatsView;
