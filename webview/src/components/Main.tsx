import { Box } from '@mui/material';
import { ActionPanel } from '@src/components/ActionPanel';
import { FilterInput } from '@src/components/FilterInput';
import { ItemList } from '@src/components/ItemList';
import { Action, useStore } from '@src/store';
import React from 'react';

export const Main = ({
  action,
}: Readonly<{ action?: Action }>): React.ReactElement => {
  const { setModifierKeys } = useStore();
  return (
    <Box
      onBlur={() => {
        setModifierKeys({
          shiftKey: false,
          controlKey: false,
          altKey: false,
          metaKey: false,
        });
      }}
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* <StatusBar /> */}
      <FilterInput />
      <ItemList />
      <ActionPanel action={action} />
    </Box>
  );
};
