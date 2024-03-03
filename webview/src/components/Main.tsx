import { Box } from '@mui/material';
import { FilterInput } from '@src/components/FilterInput';
import { ItemList } from '@src/components/ItemList';
import React from 'react';
import { ActionPanel } from './ActionPanel';

export const Main = (): React.ReactElement => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FilterInput />
      <ItemList />
      <ActionPanel />
    </Box>
  );
};
