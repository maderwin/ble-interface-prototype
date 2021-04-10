import React from 'react';
import { createMuiTheme, MuiThemeProvider, CssBaseline } from '@material-ui/core';

import { App } from 'components/App/App';
import { StoreContextProvider } from 'components/StoreContextProvider/StoreContextProvider';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#0277bd',
        },
        secondary: {
            main: '#607d8b',
        },
        background: {
            default: 'rgba(0,0,0,0.02)',
        },
    },
});

export const Root: React.FC = () => (
    <React.StrictMode>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <StoreContextProvider>
                <App />
            </StoreContextProvider>
        </MuiThemeProvider>
    </React.StrictMode>
);
