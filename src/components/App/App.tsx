import React from 'react';
import { Box } from '@material-ui/core';
import { DeviceStatus } from 'components/DeviceStatus/DeviceStatus';
import { DeviceLog } from 'components/DeviceLog/DeviceLog';
import { DeviceValues } from 'components/DeviceValues/DeviceValues';

export const App: React.FC = () => {
    return (
        <Box height="100vh" display="flex" flexDirection="column">
            <Box m={1}>
                <DeviceStatus />
            </Box>
            <Box m={1}>
                <DeviceValues />
            </Box>
            <Box m={1} mt={0} flexGrow={1}>
                <DeviceLog />
            </Box>
        </Box>
    );
};
