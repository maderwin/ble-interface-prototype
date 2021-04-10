import React from 'react';
import { observer } from 'mobx-react';
import { Box, Paper, Typography } from '@material-ui/core';
import { useDeviceValues } from './DeviceValues.hooks';

export const DeviceValues: React.FC = observer(() => {
    const { entryList } = useDeviceValues();

    return (
        <Box>
            {entryList.map(({ key, serviceName, charName, value }, index) => (
                <Paper key={key}>
                    <Box p={1} mt={index > 0}>
                        <Typography variant="caption" display="block">
                            {serviceName}
                        </Typography>
                        <Typography variant="body1" display="block">
                            {charName}: {value}
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
});
