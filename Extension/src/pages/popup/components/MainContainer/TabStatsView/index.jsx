import React from 'react';
import { observer } from 'mobx-react';

import { Table } from '../components/Table';
import { Tile } from '../components/Tile';
import { PopupView } from '../components/PopupView';

import { reactTranslator } from '../../../../../common/translators/reactTranslator';

import { formatCounter, isWebURL } from '../helpers';

import './styles.css';
import { Globe, Shield } from '../components/Icons';

const LIST_SIZE = 8;

const TabStatsView = observer(({ store }) => {
    const totalBlockedDomains = Object.keys(store.blockedDomainsTab).length;
    const { currentSite } = store || {};

    const list = Object.keys(store.blockedDomainsTab).map((domain) => (
        { domain, count: store.blockedDomainsTab[domain] }
    )).sort((a, b) => b.count - a.count).slice(0, LIST_SIZE);

    const title = reactTranslator.getMessage('popup_stats_blocked_elements');
    const subtitle = isWebURL(currentSite) ? currentSite : null;

    return (
        <PopupView title={title} subtitle={subtitle}>
            <div className="tab_stats_container">
                <div className="tiles">
                    <Tile
                        icon={<Globe />}
                        value={formatCounter(totalBlockedDomains)}
                        label={reactTranslator.getMessage('popup_stats_table_domains_label')}
                    />
                    <Tile
                        icon={<Shield />}
                        value={formatCounter(store.totalBlockedTab)}
                        label={reactTranslator.getMessage('popup_stats_trackers')}
                    />
                </div>
                <Table list={list} />
            </div>
        </PopupView>
    );
});

export default TabStatsView;
