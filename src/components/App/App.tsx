import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

import { ReactComponent as LogoSVG } from './App.assets/logo.svg';

const AppContainer = styled.div`
    text-align: center;
`;

const Header = styled.header`
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
`;

const logoSpinAnimation = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const Logo = styled(LogoSVG)`
    height: 40vmin;
    width: 40vmin;
    pointer-events: none;

    @media (prefers-reduced-motion: no-preference) {
        animation: ${logoSpinAnimation} infinite 20s linear;
    }
`;

const Code = styled.code`
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
`;

const Link = styled.a`
    color: #61dafb;
`;

export const App: React.FC = () => (
    <AppContainer>
        <Header>
            <Logo />
            <p>
                Edit <Code>src/components/App.tsx</Code> and save to reload.
            </p>
            <Link href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                Learn React
            </Link>
        </Header>
    </AppContainer>
);
