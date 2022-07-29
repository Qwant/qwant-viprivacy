import { configure } from 'mobx';
import { createContext } from 'react';

import SettingsStore from './SettingsStore';

// Do not allow property change outside of store actions
configure({ enforceActions: 'observed' });

class RootStore {
    constructor() {
        this.settingsStore = new SettingsStore(this);
    }
}

export const rootStore = createContext(new RootStore());
