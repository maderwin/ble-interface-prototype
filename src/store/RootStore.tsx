import { DeviceStore } from 'store/DeviceStore';

export interface Store {
    dispose: () => void;
}

export class RootStore implements Store {
    deviceStore = new DeviceStore(this);

    constructor() {
        window.addEventListener('unload', this.dispose);
    }

    dispose = () => {
        this.deviceStore.dispose();
    };
}

export const rootStore = new RootStore();
