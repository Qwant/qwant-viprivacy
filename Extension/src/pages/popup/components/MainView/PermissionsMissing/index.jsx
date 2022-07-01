import React from 'react';

import { t } from '~src/common/translators/reactTranslator';

import './styles.css';
import { Button } from '@qwant/qwant-ponents';

export const PermissionsMissing = ({ inlineCTA, onRequestPermissions }) => {
    return (
        <div>
            <div className="section-no-permission section-default-browser">
                <div>
                    <div className="permission_missing__title">
                        {t('missing_permissions_default_search_engine_title')}
                    </div>
                    <div>
                        {t('missing_permissions_default_search_engine_description')}
                    </div>
                </div>
            </div>

            <div className="section-no-permission section-enable-permissions">
                <div>
                    <div className="permission_missing__title">
                        {t('missing_permissions_disabled_title')}
                    </div>
                    <div>
                        {t('missing_permissions_disabled_description')}
                    </div>

                    {!inlineCTA && (
                        <Button className="cta" name="enable-protection" size="small" onClick={onRequestPermissions}>
                            {t('missing_permissions_cta_button_popup')}
                        </Button>
                    )}

                </div>
                <div>
                    {inlineCTA && (
                        <Button className="cta-inline" name="enable-protection" size="small" variant="secondary-black" onClick={onRequestPermissions}>
                            {t('missing_permissions_cta_button_popup')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
