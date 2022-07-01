import React from 'react';
import { observer } from 'mobx-react';

import { t } from '~src/common/translators/reactTranslator';
import { Box, Stack, Text } from '@qwant/qwant-ponents';
import { Table } from '../shared/Table/Table';
import { Tile } from '../shared/Tile/Tile';
import emptyStatsImage from './empty-stats.svg';

import { formatCounter, isWebURL } from '../../helpers';

import { IconGlobe, IconShield } from '../shared/Icons';

const LIST_SIZE = 8;

const TabStatsView = observer(({ store }) => {
    const totalBlockedDomains = Object.keys(store.blockedDomainsTab).length;
    const { currentSite, totalBlockedTab = 0 } = store || {};

    const list = Object.keys(store.blockedDomainsTab).map((domain) => (
        { domain, count: store.blockedDomainsTab[domain] }
    )).sort((a, b) => b.count - a.count).slice(0, LIST_SIZE);

    const domainCount = list.reduce((prev, current) => prev + current.count, 0);
    const count = totalBlockedTab >= domainCount ? totalBlockedTab : domainCount;

    const websiteUrl = isWebURL(currentSite) ? currentSite : null;

    return (
        <Stack gap="s">
            <Stack gap="xxs">
                <Text typo="heading-5" bold color="primary" as="h1">
                    {t('popup_stats_blocked_elements')}
                </Text>
                <Text typo="body-2" color="primary">
                    {websiteUrl && t('popup_main_nbr_blocked_elements_domain', { domain: websiteUrl })}
                </Text>
            </Stack>

            <Stack gap="s" horizontal nowrap>
                <Tile
                    icon={IconGlobe}
                    value={formatCounter(totalBlockedDomains)}
                    label={t('popup_stats_table_domains_label')}
                />
                <Tile
                    icon={IconShield}
                    value={formatCounter(count)}
                    label={t('popup_stats_trackers')}
                />
            </Stack>

            {list.length > 0
                ? <Table list={list} />
                : (
                    <Box mt="s">
                        <img src={emptyStatsImage} alt="" />
                    </Box>
                )}

        </Stack>
    );
});

export default TabStatsView;
