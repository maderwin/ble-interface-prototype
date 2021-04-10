import React from 'react';
import { observer } from 'mobx-react';
import { Box, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import { Virtuoso } from 'react-virtuoso';
import { mapServiceToName, mapCharToName, formatValue } from 'tools/ble';

import { useDeviceLog } from './DeviceLog.hooks';

interface EntriesListProps {
    style?: React.CSSProperties;
}

const EntriesList = React.forwardRef<HTMLDivElement, EntriesListProps>(({ style, children }, listRef) => (
    <List style={{ padding: 0, ...style, margin: 0, width: '100%' }} component="div" ref={listRef}>
        {children}
    </List>
));

EntriesList.displayName = 'EntriesList';

const EntriesListItem: React.FC = ({ children, ...props }) => (
    <ListItem component="div" disableGutters {...props}>
        {children}
    </ListItem>
);

const components = {
    List: EntriesList,
    Item: EntriesListItem,
};

export const DeviceLog: React.FC = observer(() => {
    const { entriesList } = useDeviceLog();

    return (
        <Virtuoso
            height="100%"
            components={components}
            totalCount={entriesList.length}
            itemContent={(index) => {
                const entry = entriesList[entriesList.length - index - 1];

                return (
                    <Paper style={{ width: '100%' }}>
                        <Box p={1}>
                            <ListItemText
                                primary={entry.time.toISOString()}
                                secondary={
                                    <>
                                        <p>{entry.deviceName || entry.deviceId}</p>
                                        <p>{mapServiceToName[entry.serviceId]}</p>
                                        <p>{mapCharToName[entry.charId]}</p>
                                        <p>{formatValue(entry.charId, entry.value)}</p>
                                    </>
                                }
                            />
                        </Box>
                    </Paper>
                );
            }}
        />
    );
});
