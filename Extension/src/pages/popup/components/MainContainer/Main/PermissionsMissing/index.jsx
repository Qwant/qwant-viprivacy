import React from 'react';

import { Button } from '../../../../../common/components/Button';
import { Check } from '../../components/Icons';
import { reactTranslator } from '../../../../../../common/translators/reactTranslator';

import './styles.css';

export const PermissionsMissing = ({ inlineCTA, onRequestPermissions }) => {
    return (
        <div>
            <div className="section-no-permission section-default-browser">
                <div>
                    <div className="permission_missing__title">
                        {reactTranslator.getMessage('missing_permissions_default_search_engine_title')}
                    </div>
                    <div>
                        {reactTranslator.getMessage('missing_permissions_default_search_engine_description')}
                    </div>
                </div>
                <div>
                    <Check />
                </div>
            </div>

            <div className="section-no-permission section-enable-permissions">
                <div>
                    <div className="permission_missing__title">
                        {reactTranslator.getMessage('missing_permissions_disabled_title')}
                    </div>
                    <div>
                        {reactTranslator.getMessage('missing_permissions_disabled_description')}
                    </div>

                    {!inlineCTA && (
                        <Button className="cta" name="enable-protection" size="small" onClick={onRequestPermissions}>
                            {reactTranslator.getMessage('missing_permissions_cta_button_popup')}
                        </Button>
                    )}

                </div>
                <div>
                    {inlineCTA && (
                        <Button className="cta-inline" name="enable-protection" size="small" color="secondary" onClick={onRequestPermissions}>
                            {reactTranslator.getMessage('missing_permissions_cta_button_popup')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
