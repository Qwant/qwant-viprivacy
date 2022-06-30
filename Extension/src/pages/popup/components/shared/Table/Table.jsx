import React from 'react';
import { reactTranslator } from '~src/common/translators/reactTranslator';
import { Card, Text } from '@qwant/qwant-ponents';
import Styles from './Table.module.scss';

export const Table = ({ list }) => {
    if (!list || !Array.isArray(list) || list.length === 0) {
        return null;
    }

    return (
        <Card as="table" className={Styles.Table}>
            <thead>
                <tr>
                    <Text typo="body-2" as="th" bold>{reactTranslator.getMessage('popup_stats_table_domains_label')}</Text>
                    <Text center typo="body-2" as="th" bold>{reactTranslator.getMessage('popup_stats_table_trackers_label')}</Text>
                </tr>
            </thead>
            <tbody>
                {list.map((element) => (
                    <tr key={element.domain}>
                        <Text typo="body-2" as="td">{element.domain}</Text>
                        <Text typo="body-2" as="td" center>{element.count}</Text>
                    </tr>
                ))}
            </tbody>
        </Card>
    );
};
