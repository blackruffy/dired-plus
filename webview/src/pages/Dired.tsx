import { Box, Divider } from '@mui/material';
import { ActionPanel } from '@src/components/ActionPanel';
import { Dialog } from '@src/components/Dialog';
import { DiredSearchBox } from '@src/components/DiredSearchBox';
import { ItemList } from '@src/components/ItemList';
import { SearchHint } from '@src/components/SearchHint';
import { StatusBar } from '@src/components/StatusBar';
import { Action, useStore } from '@src/store';
import React from 'react';

export const Dired = ({
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
        <DiredSearchBox />
        <ItemList />
        <Dialog />
      </Box>
      <ActionPanel action={action} />
      <Divider />
      <StatusBar />
    </Box>
  );
};
