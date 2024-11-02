import { Action } from '@core/action';
import { Dialog } from '@core/components/Dialog';
import { ItemListView, ItemViewParms } from '@core/components/ItemListView';
import { KeyDesc, KeyboardHint } from '@core/components/KeyboardHint';
import { SearchBox, UpdateItemListArgs } from '@core/components/SearchBox';
import { StatusBar } from '@core/components/StatusBar';
import * as store from '@core/store';
import { typeclass } from '@core/utils';
import { Box, Divider } from '@mui/material';
import React from 'react';
import { SearchHint } from './SearchHint';

export const SearchPane = <State, Item, ItemList, IntlId extends string>({
  state,
  action,
  searchHintMessage,
  updateItemList,
  ItemView,
  instances,
}: Readonly<{
  state: store.State<State, IntlId, ItemList>;
  action?: Action<State, IntlId>;
  searchHintMessage?: React.ReactElement;
  updateItemList: (args: UpdateItemListArgs<ItemList>) => void;
  ItemView: (args: ItemViewParms<Item>) => React.ReactElement;
  instances: Readonly<{
    itemInstance: typeclass.Item<Item>;
    itemListInstance: typeclass.ItemList<ItemList, Item>;
  }>;
}>): React.ReactElement => {
  const actionKeys: ReadonlyArray<KeyDesc<IntlId>> =
    state.dialog?.keys ?? action?.keys ?? [];

  return (
    <Box
      onBlur={() => {
        state.setModifierKeys({
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
        <SearchHint message={searchHintMessage} />
        <SearchBox
          searchWord={state.searchWord}
          itemList={state.itemList}
          setSearchWord={state.setSearchWord}
          setItemList={state.setItemList}
          setSelectedView={state.setSelectedView}
          updateItemList={updateItemList}
        />
        <ItemListView
          itemList={state.itemList}
          selectedView={state.selectedView}
          setSearchWord={state.setSearchWord}
          setSelectedView={state.setSelectedView}
          ItemView={ItemView}
          instances={instances}
        />
        <Dialog dialog={state.dialog} />
      </Box>
      <KeyboardHint actionKeys={actionKeys} />
      <Divider />
      <StatusBar status={state.status} setStatus={state.setStatus} />
    </Box>
  );
};
