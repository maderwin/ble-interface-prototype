import { AlertProps } from '@material-ui/lab';
import { useStore } from 'hooks/useStore';
import { ProviderStatus } from 'providers/BLEDevice';

const mapStatusToText: Record<ProviderStatus, string> = {
    [ProviderStatus.INITIAL]: 'Initial',
    [ProviderStatus.DISCOVERING]: 'Discovering',
    [ProviderStatus.DISCOVERED]: 'Discovered',
    [ProviderStatus.CONNECTING]: 'Connecting',
    [ProviderStatus.CONNECTED]: 'Connected',
    [ProviderStatus.DISCONNECTED]: 'Disconnected',
    [ProviderStatus.ERROR]: 'Error',
};

const mapStatusToCategory: Record<ProviderStatus, AlertProps['severity']> = {
    [ProviderStatus.INITIAL]: undefined,
    [ProviderStatus.DISCOVERING]: 'info',
    [ProviderStatus.DISCOVERED]: 'info',
    [ProviderStatus.CONNECTING]: 'info',
    [ProviderStatus.CONNECTED]: 'success',
    [ProviderStatus.DISCONNECTED]: 'warning',
    [ProviderStatus.ERROR]: 'error',
};

export const useDeviceStatus = () => {
    const { deviceStore } = useStore();

    const isDiscoverButtonDisabled = deviceStore.provider.isInProgress;

    const isConnectButtonDisabled =
        deviceStore.provider.status !== ProviderStatus.DISCONNECTED &&
        deviceStore.provider.status !== ProviderStatus.DISCOVERED;

    const isDisconnectButtonDisabled = deviceStore.provider.status !== ProviderStatus.CONNECTED;

    return {
        isDiscoverButtonDisabled,
        isConnectButtonDisabled,
        isDisconnectButtonDisabled,
        handleDiscoverClick: deviceStore.discover,
        handleConnectClick: deviceStore.connect,
        handleDisconnectClick: deviceStore.disconnect,
        statusText: mapStatusToText[deviceStore.provider.status],
        statusCategory: mapStatusToCategory[deviceStore.provider.status],
    };
};
