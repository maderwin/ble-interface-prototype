import { useStore } from 'hooks/useStore';

export const useDeviceLog = () => {
    const { deviceStore } = useStore();

    const entriesList = deviceStore.logEntriesList;

    return {
        entriesList,
    };
};
