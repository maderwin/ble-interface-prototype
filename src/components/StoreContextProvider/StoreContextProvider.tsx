import React from 'react';
import { RootStore, rootStore } from 'store/RootStore';

export const StoreContext = React.createContext<RootStore>({} as RootStore);

export const StoreContextProvider: React.FC = ({ children }) => (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
);
