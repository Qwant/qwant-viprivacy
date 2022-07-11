import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import {
    Box, Button, Stack, Text, Flex,
} from '@qwant/qwant-ponents';
import { RiDeleteBinLine as IconTrash, RiLineChartLine as IconChart } from 'react-icons/ri';
import { t } from '~src/common/translators/reactTranslator';
import { useToggle } from 'react-use';
import { Table } from '../shared/Table/Table';
import { Tile } from '../shared/Tile/Tile';
import emptyStatsImage from './empty-stats.svg';
import disabledStatsImage from './disabled-stats.svg';

import { formatAnnoyanceTime, formatCounter } from '../../helpers';
import { IconShield, IconTime } from '../shared/Icons';
import { useKonamiCode } from './useKonami';
import { ActionButton } from './ActionButton/ActionButton';

const LIST_SIZE = 5;

const GlobalStatsView = observer(({ store }) => {
    const [isKonami] = useKonamiCode();
    const [showDisableConfirm, toggleShowDisableConfirm] = useToggle(false);
    const [justEnabled, setJustEnabled] = useState(false);

    const annoyanceTime = React.useMemo(() => formatAnnoyanceTime(store.totalBlocked),
        [store.totalBlocked]);

    const { showGlobalStats } = store;
    const domains = store.blockedDomains?.total?.domains || [];
    const domainsStr = JSON.stringify(store.blockedDomains);

    useEffect(() => {
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
    )).sort((a, b) => b.count - a.count).slice(0, LIST_SIZE);

    const toggleGlobalStats = () => {
        if (showDisableConfirm) {
            toggleShowDisableConfirm();
        } else {
            setJustEnabled(true);
        }
        store.setShowGlobalStats(!showGlobalStats);
        if (showGlobalStats) {
            store.deleteBlockedDomains();
        }
    };

    const onDelete = () => {
        store.deleteBlockedDomains();
    };

    if (showDisableConfirm) {
        return <DisableConfirmView onConfirm={toggleGlobalStats} />;
    }

    if (!showGlobalStats) {
        return <DisabledView onEnable={toggleGlobalStats} />;
    }

    if (list.length === 0) {
        return <EmptyView justEnabled={justEnabled} />;
    }

    return (
        <Flex column between takeAvailableSpace style={{ height: 'calc(100vh - 72px)' }}>

            <Stack gap="s">
                <Text typo="heading-5" bold color="primary" as="h1">
                    {t('global_stats')}
                </Text>

                <Stack gap="s" horizontal nowrap>
                    <Tile
                        icon={IconShield}
                        label={t('popup_stats_trackers')}
                        value={formatCounter(store.totalBlocked)}
                        color="purple"
                    />
                    <Tile
                        icon={IconTime}
                        label={t('popup_stats_time_saved')}
                        value={annoyanceTime}
                        color="purple"
                    />
                </Stack>
                <div style={{ minHeight: 212 }}>
                    <Table list={list} />
                </div>
            </Stack>

            <Stack gap="xs">
                <ActionButton type="danger" onClick={toggleShowDisableConfirm}>
                    <IconChart />
                    <span>{t('global_stats_disable_action')}</span>
                </ActionButton>
                <ActionButton onClick={onDelete}>
                    <IconTrash />
                    <span>{t('delete')}</span>
                </ActionButton>
            </Stack>
        </Flex>
    );
});

function EmptyView({ justEnabled }) {
    return (
        <>
            <Stack gap="xxs" mb="xxl4">
                <Text typo="heading-5" bold color="primary" as="h1">
                    {t('global_stats')}
                </Text>
                <Text typo="body-2" color="primary">
                    {t(justEnabled
                        ? 'global_stats_enabled_success' : 'global_stats_empty')}
                </Text>
            </Stack>
            <Box mt="xxl7">
                <img src={emptyStatsImage} alt="" />
            </Box>
        </>
    );
}

function DisabledView({ onEnable }) {
    return (
        <>
            <Stack gap="xxs" mb="xxl4">
                <Text typo="heading-5" bold color="primary" as="h1">
                    {t('global_stats')}
                </Text>
                <Text typo="body-2" color="primary">
                    {t('global_stats_disabled')}
                </Text>
            </Stack>
            <Box mb="xl">
                <img src={disabledStatsImage} alt="" />
            </Box>
            <Button variant="primary-black" full onClick={onEnable}>
                <IconChart />
                {t('global_stats_enable')}
            </Button>
        </>
    );
}

function DisableConfirmView({ onConfirm }) {
    return (
        <>
            <Stack gap="xxs" mb="xl">
                <Text typo="heading-5" bold color="primary" as="h1">
                    {t('global_stats_disable_title')}
                </Text>
                <Text typo="body-2" color="primary">
                    {t('global_stats_disable_description')}
                </Text>
            </Stack>
            <ActionButton type="danger" full onClick={onConfirm}>
                <IconChart />
                {t('global_stats_disable_action_confirm')}
            </ActionButton>
        </>
    );
}

export default GlobalStatsView;
