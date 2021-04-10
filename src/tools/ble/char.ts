export enum BLEChar {
    BATTERY_VALUE = '00002a19-0000-1000-8000-00805f9b34fb',
}

export const mapCharToName: Record<BLEChar, string> = {
    [BLEChar.BATTERY_VALUE]: 'Battery Value (%)',
};
