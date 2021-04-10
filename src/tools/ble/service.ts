export enum BLEService {
    BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb',
}

export const mapServiceToName: Record<BLEService, string> = {
    [BLEService.BATTERY_SERVICE]: 'Battery Service',
};
