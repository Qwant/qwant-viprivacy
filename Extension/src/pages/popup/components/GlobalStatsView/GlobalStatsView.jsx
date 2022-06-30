import React from 'react';
import { observer } from 'mobx-react';

import { Stack, Text } from '@qwant/qwant-ponents';
import { RiDeleteBinLine as IconTrash, RiLineChartLine as IconChart } from 'react-icons/ri';
import { Table } from '../shared/Table/Table';
import { Tile } from '../shared/Tile/Tile';

import { reactTranslator } from '../../../../common/translators/reactTranslator';

import { formatAnnoyanceTime, formatCounter } from '../../helpers';
import { IconShield, IconTime } from '../shared/Icons';
import { useKonamiCode } from './useKonami';
import { ActionButton } from './ActionButton/ActionButton';

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

    return (
        <Stack gap="s">
            <Text typo="heading-5" bold color="primary" as="h1">
                {reactTranslator.getMessage('global_stats')}
            </Text>

            <Stack gap="s" horizontal nowrap>
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
            </Stack>
            <Table list={list} />
            <Stack gap="xs">
                <ActionButton type="danger" onClick={toggleGlobalStats}>
                    <IconChart />
                    <span>Désactiver les statistiques</span>
                </ActionButton>
                <ActionButton onClick={onDelete}>
                    <IconTrash />
                    <span>Effacer</span>
                </ActionButton>
            </Stack>
        </Stack>
    );
});

export default GlobalStatsView;
