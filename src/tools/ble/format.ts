import { BLEChar } from './char';

export const formatValue = (charId: BLEChar, value: DataView): string => {
    switch (charId) {
        case BLEChar.BATTERY_VALUE:
            return `${value.getUint8(0).toFixed(0)}%`;

        default:
            return Array(value.byteLength)
                .fill(0)
                .map((_, index) => value.getUint8(index).toString(16))
                .join('');
    }
};
