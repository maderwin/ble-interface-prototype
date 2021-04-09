import React from 'react';

import { App } from 'components/App/App';
import { GlobalStyle } from 'components/GlobalStyle/GlobalStyle';

export const Root: React.FC = () => (
    <React.StrictMode>
        <GlobalStyle />
        <App />
    </React.StrictMode>
);
