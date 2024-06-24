import { Box, Typography } from '@mui/material';
import { useStore } from '@src/store';
import React from 'react';

export const StatusBar = (): React.ReactElement => {
  const { mode } = useStore();
  return (
    <Box sx={{ minHeight: `1.5em` }}>
      <Typography>{}</Typography>
    </Box>
  );
};
