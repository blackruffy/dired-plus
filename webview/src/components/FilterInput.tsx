import { TextField } from '@mui/material';
import { useStore } from '@src/store';
import React from 'react';

export const FilterInput = (): React.ReactElement => {
  const { itemList } = useStore();
  return <TextField fullWidth variant='standard' label={itemList?.path} />;
};
