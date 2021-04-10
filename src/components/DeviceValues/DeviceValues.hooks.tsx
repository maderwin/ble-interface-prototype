import React from 'react';
import { useStore } from 'hooks/useStore';
import { mapCharToName, formatValue, mapServiceToName } from 'tools/ble';
import { LogEntry } from 'store/DeviceStore';

export const useDeviceValues = () => {
    const { deviceStore } = useStore();

    const entryList = React.useMemo(
        () =>
            Object.values(deviceStore.valuesMap)
                .filter<LogEntry>((entry): entry is LogEntry => Boolean(entry))
                .map(({ charId, serviceId, value }) => ({
                    key: `${charId}/${serviceId}`,
                    serviceName: mapServiceToName[serviceId],
                    charName: mapCharToName[charId],
                    value: formatValue(charId, value),
                })),
        [deviceStore.valuesMap],
    );

    return { entryList };
};
