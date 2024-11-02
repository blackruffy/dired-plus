import { SearchPane } from '@core/components/SearchPane';
import { Action } from '@history/action/use-action';
import { Item, useStore } from '@history/store';
import {
  itemInstance,
  itemListInstance,
  updateItemList,
} from '@history/utils/item-list';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

const ItemView = ({
  item,
}: Readonly<{
  index: number;
  item: Item;
}>): React.ReactElement => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          paddingRight: theme.spacing(0.5),
          paddingLeft: theme.spacing(0.5),
          color: theme.palette.text.primary,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography>{item}</Typography>
      </Box>
    </Box>
  );
};

export const History = ({
  action,
}: Readonly<{ action?: Action }>): React.ReactElement => {
  const state = useStore();

  return (
    <SearchPane
      state={state}
      action={action}
      updateItemList={args =>
        updateItemList({ ...args, history: state.history })
      }
      ItemView={ItemView}
      instances={{ itemInstance, itemListInstance }}
    />
  );
};
