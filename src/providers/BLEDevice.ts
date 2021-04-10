import { makeAutoObservable } from 'mobx';
import { createLogger } from 'tools/logger';
import { retry } from 'tools/retry';

const logger = createLogger('BLEDeviceProvider');

class BLEDeviceProviderError extends Error {
    name = 'BLEDeviceProviderError';
}

export enum ProviderStatus {
    INITIAL = 'INITIAL',
    DISCOVERING = 'DISCOVERING',
    DISCOVERED = 'DISCOVERED',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    ERROR = 'ERROR',
}

const statusInProgress: ProviderStatus[] = [ProviderStatus.DISCOVERING, ProviderStatus.CONNECTING];

export enum ProviderEvents {
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    DISCOVERED = 'DISCOVERED',
    ERROR = 'ERROR',
}

const retryWaitMs = 100;
const retryMaxTries = 10;

export class BLEDeviceProvider {
    private _requestOptions: RequestDeviceOptions;
    private _eventTarget = new EventTarget();

    device: BluetoothDevice | undefined;
    status = ProviderStatus.INITIAL;

    constructor(options: RequestDeviceOptions) {
        makeAutoObservable(this);

        this._requestOptions = options;
    }

    get isInProgress() {
        return statusInProgress.includes(this.status);
    }

    setStatus = (status: ProviderStatus) => {
        this.status = status;
    };

    setDevice = (device: BluetoothDevice | undefined) => {
        this.device = device;
    };

    discover = async () => {
        if (this.isInProgress) {
            throw new BLEDeviceProviderError('Cannot discover while another action is in progress');
        }

        if (this.status === ProviderStatus.CONNECTED) {
            logger.log('Trying to discover while connected...');
            this.disconnect();
        }

        this.setStatus(ProviderStatus.DISCOVERING);

        logger.log('Selecting device...');

        this.setDevice(await navigator.bluetooth.requestDevice(this._requestOptions));

        if (!this.device) {
            this.setStatus(ProviderStatus.INITIAL);
            logger.log('No device selected');
            return;
        }

        logger.log(`Selected device ${this.device.id}`);

        this.setStatus(ProviderStatus.DISCOVERED);
        this._dispatchEvent(ProviderEvents.DISCOVERED);
    };

    connect = async () => {
        if (!this.device?.gatt) {
            throw new BLEDeviceProviderError('Trying to connect, but no device discovered');
        }

        this.setStatus(ProviderStatus.CONNECTING);

        try {
            await retry(
                async () => {
                    const gattServer = await this.device?.gatt?.connect();

                    if (!gattServer) {
                        throw new BLEDeviceProviderError('Cannot connect to device');
                    }
                },
                retryWaitMs,
                { maxTries: retryMaxTries },
            );

            this.device.addEventListener('gattserverdisconnected', this._onDisconnected);

            this.setStatus(ProviderStatus.CONNECTED);
            this._dispatchEvent(ProviderEvents.CONNECTED);
        } catch (error) {
            logger.error(error);
            this.setStatus(ProviderStatus.ERROR);
            this._dispatchEvent(ProviderEvents.ERROR);
        }
    };

    getService = async (serviceId: string) => {
        if (!this.device?.gatt) {
            throw new BLEDeviceProviderError(`Trying to retrieve service ${serviceId}, but no device connected`);
        }

        return this.device.gatt.getPrimaryService(serviceId);
    };

    getCharacteristic = async (serviceId: string, characteristicId: string) => {
        const service = await this.getService(serviceId);

        return service.getCharacteristic(characteristicId);
    };

    disconnect = () => {
        if (!this.device) {
            logger.warn('Trying to disconnect, but no device connected');
            return;
        }

        this.device.removeEventListener('gattserverdisconnected', this._onDisconnected);

        this.device.gatt?.disconnect();

        logger.log('Device is disconnected');
        this.setStatus(ProviderStatus.DISCONNECTED);
        this._dispatchEvent(ProviderEvents.DISCONNECTED);
    };

    private _onDisconnected = () => {
        this.setStatus(ProviderStatus.CONNECTING);
        logger.warn('Device is disconnected, trying to reconnect...');
        this._dispatchEvent(ProviderEvents.DISCONNECTED);

        this.connect();
    };

    addEventListener = (eventName: ProviderEvents, listener: () => void) => {
        this._eventTarget.addEventListener(eventName, listener);
    };

    removeEventListener = (eventName: ProviderEvents, listener: () => void) => {
        this._eventTarget.removeEventListener(eventName, listener);
    };

    private _dispatchEvent = (eventName: ProviderEvents) => {
        this._eventTarget.dispatchEvent(new Event(eventName));
    };
}
