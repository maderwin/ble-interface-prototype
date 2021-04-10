import React from 'react';

import { StoreContext } from 'components/StoreContextProvider/StoreContextProvider';

export const useStore = () => React.useContext(StoreContext);
