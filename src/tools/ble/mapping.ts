import { BLEChar } from './char';
import { BLEService } from './service';

export const mapCharToToService: Record<BLEChar, BLEService> = {
    [BLEChar.BATTERY_VALUE]: BLEService.BATTERY_SERVICE,
};

export const mapServiceToCharList = Object.entries(mapCharToToService).reduce<Record<BLEService, BLEChar[]>>(
    (acc, [charId, serviceId]) => {
        acc[serviceId] = [...(acc[serviceId] ?? []), charId as BLEChar];

        return acc;
    },
    {} as Record<BLEService, BLEChar[]>,
);
