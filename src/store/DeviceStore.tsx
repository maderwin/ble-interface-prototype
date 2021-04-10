import { makeAutoObservable } from 'mobx';
import memoize from 'lodash.memoize';
import throttle from 'lodash.throttle';
import assert from 'assert';
import { BLEDeviceProvider, ProviderEvents } from 'providers/BLEDevice';
import { Store, RootStore } from 'store/RootStore';
import { createLogger } from 'tools/logger';
import { BLEService, mapServiceToName, BLEChar, mapCharToName, mapCharToToService, formatValue } from 'tools/ble';

const logger = createLogger('DeviceStore');

const subscriptionChart: Record<BLEService, BLEChar[] | undefined> = {
    [BLEService.BATTERY_SERVICE]: [BLEChar.BATTERY_VALUE],
};

Object.entries(subscriptionChart).forEach(([serviceId, charIdList]) =>
    charIdList?.forEach((charId) =>
        assert(
            mapCharToToService[charId] === serviceId,
            `Char "${mapCharToName[charId]}" (${charId}) is not belonging to ` +
                `service "${mapServiceToName[serviceId as BLEService]}" (${serviceId})`,
        ),
    ),
);

export interface LogEntry {
    time: Date;
    deviceId: string;
    deviceName: string;
    serviceId: BLEService;
    charId: BLEChar;
    value: DataView;
}

const notificationTimeoutMs = 1000;

export class DeviceStore implements Store {
    rootStore: RootStore;
    provider: BLEDeviceProvider;
    logEntriesList: LogEntry[] = [];
    valuesMap: Record<string, LogEntry | undefined> = {};

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.provider = new BLEDeviceProvider({
            acceptAllDevices: true,
            optionalServices: Object.keys(subscriptionChart),
        });

        makeAutoObservable(this);

        this.provider.addEventListener(ProviderEvents.DISCOVERED, this.connect);
        this.provider.addEventListener(ProviderEvents.CONNECTED, this.subscribeAll);
    }

    write = async () => {};

    read = async (serviceId: BLEService, charId: BLEChar) => {
        const char = await this.provider.getCharacteristic(serviceId, charId);

        logger.log(`Reading [${serviceId}/${charId}]...`);

        const value = await char.readValue();

        logger.log(`Read ${value.byteLength} bytes [${serviceId}/${charId}]:`, formatValue(charId, value));

        this.addLogEntry({
            time: new Date(),
            deviceId: this.provider.device?.id ?? '',
            deviceName: this.provider.device?.name ?? '',
            serviceId,
            charId,
            value,
        });
    };

    private handleNotification = memoize((id: string) => {
        const store = this;

        return throttle(
            function (this: BluetoothRemoteGATTCharacteristic) {
                logger.log(`Notification [${id}]:`, this);

                const serviceId = (this.service?.uuid ?? '') as BLEService;
                const charId = this.uuid as BLEChar;

                if (serviceId) {
                    store.read(serviceId, charId);
                }
            },
            notificationTimeoutMs,
            { leading: true, trailing: true },
        );
    });

    private subscribe = async (serviceId: BLEService, charId: BLEChar) => {
        const char = await this.provider.getCharacteristic(serviceId, charId);

        await this.read(serviceId, charId);

        logger.log(`Subscribing on ${serviceId}/${charId}...`);

        char.addEventListener('characteristicvaluechanged', this.handleNotification(`${serviceId}/${charId}`));
        await char.startNotifications();

        logger.log(`Subscribed on ${serviceId}/${charId}`);
    };

    private unsubscribe = async (serviceId: BLEService, charId: BLEChar) => {
        const char = await this.provider.getCharacteristic(serviceId, charId);

        logger.log(`Unsubscribing on ${serviceId}/${charId}...`);

        await char.stopNotifications();
        char.removeEventListener('characteristicvaluechanged', this.handleNotification(`${serviceId}/${charId}`));

        logger.log(`Unsubscribing on ${serviceId}/${charId}`);
    };

    private subscribeAll = async () =>
        Promise.allSettled(
            Object.entries(subscriptionChart)
                .flatMap(([serviceId, charIdList]) => charIdList?.map((charId) => [serviceId, charId]))
                .filter<string[]>(Array.isArray)
                .map(([serviceId, charId]) => this.subscribe(serviceId as BLEService, charId as BLEChar)),
        );

    private unsubscribeAll = async () =>
        Promise.allSettled(
            Object.entries(subscriptionChart)
                .flatMap(([serviceId, charIdList]) => charIdList?.map((charId) => [serviceId, charId]))
                .filter<string[]>(Array.isArray)
                .map(([serviceId, charId]) => this.unsubscribe(serviceId as BLEService, charId as BLEChar)),
        );

    discover = async () => {
        await this.provider.discover();
    };

    connect = async () => {
        await this.provider.connect();
    };

    disconnect = async () => {
        this.unsubscribeAll();
        this.provider.disconnect();
    };

    dispose = () => {
        this.disconnect();
    };

    addLogEntry = (entry: LogEntry) => {
        const id = `${entry.serviceId}/${entry.charId}`;

        const lastValue = this.valuesMap[id]?.value;

        if (
            lastValue &&
            lastValue.byteLength === entry.value.byteLength &&
            Array(lastValue.byteLength)
                .fill(0)
                .every((_, index) => lastValue.getUint8(index) === entry.value.getUint8(index))
        ) {
            return;
        }

        this.logEntriesList.push(entry);

        this.valuesMap = {
            ...this.valuesMap,
            ...{ [id]: entry },
        };
    };
}
