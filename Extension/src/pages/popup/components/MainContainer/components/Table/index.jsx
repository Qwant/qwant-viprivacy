import React from 'react';
import { reactTranslator } from '../../../../../../common/translators/reactTranslator';
import './styles.css';

export const Table = ({ list }) => {
    if (!list || !Array.isArray(list) || list.length === 0) {
        return null;
    }

    return (
        <div className="table-wrapper">

            <table className="table">
                <thead>
                    <tr>
                        <th>{reactTranslator.getMessage('popup_stats_table_domains_label')}</th>
                        <th>{reactTranslator.getMessage('popup_stats_table_trackers_label')}</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((element) => (
                        <tr key={element.domain}>
                            <td>{element.domain}</td>
                            <td>{element.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
