import { Box, Divider } from '@mui/material';
import { ActionPanel } from '@src/components/ActionPanel';
import { FilterInput } from '@src/components/FilterInput';
import { ItemList } from '@src/components/ItemList';
import { Action, useStore } from '@src/store';
import React from 'react';
import { Dialog } from './Dialog';
import { SearchHint } from './SearchHint';
import { StatusBar } from './StatusBar';

export const Main = ({
  action,
}: Readonly<{ action?: Action }>): React.ReactElement => {
  const { mode, setModifierKeys } = useStore();

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
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <SearchHint mode={mode} />
        <FilterInput />
        <ItemList />
        <Dialog />
      </Box>
      <ActionPanel action={action} />
      <Divider />
      <StatusBar />
    </Box>
  );
};
