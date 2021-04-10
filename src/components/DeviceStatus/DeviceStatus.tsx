import React from 'react';
import { observer } from 'mobx-react';
import { Box, Button, Paper, styled, withTheme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { useDeviceStatus } from './DeviceStatus.hooks';

const StyledPaper = styled(withTheme(Paper))(({ theme }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
        justifyContent: 'left',
        '& > *:nth-child(n+2)': {
            marginLeft: theme.spacing(1),
        },
    },
}));

export const DeviceStatus: React.FC = observer(() => {
    const {
        isDiscoverButtonDisabled,
        isConnectButtonDisabled,
        isDisconnectButtonDisabled,
        handleDiscoverClick,
        handleConnectClick,
        handleDisconnectClick,
        statusText,
        statusCategory,
    } = useDeviceStatus();

    return (
        <>
            <Box mb={2}>
                <Paper>
                    <Alert severity={statusCategory}>{statusText}</Alert>
                </Paper>
            </Box>
            <Box>
                <StyledPaper>
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        disabled={isDiscoverButtonDisabled}
                        onClick={handleDiscoverClick}
                    >
                        Discover
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        disabled={isConnectButtonDisabled}
                        onClick={handleConnectClick}
                    >
                        Connect
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        disabled={isDisconnectButtonDisabled}
                        onClick={handleDisconnectClick}
                    >
                        Disconnect
                    </Button>
                </StyledPaper>
            </Box>
        </>
    );
});
