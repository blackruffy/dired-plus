import { Box, Divider } from '@mui/material';
import { Dialog } from '@src/components/Dialog';
import {
  ItemBase,
  ItemListBase,
  ItemListView,
  ItemViewParms,
} from '@src/components/ItemListView';
import { KeyDesc, KeyboardHint } from '@src/components/KeyboardHint';
import { SearchBox, UpdateItemListArgs } from '@src/components/SearchBox';
import { StatusBar } from '@src/components/StatusBar';
import { messageId } from '@src/i18n/ja';
import { Action, Mode, ModifierKeys, SelectedView, Status } from '@src/store';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { SearchHint } from './SearchHint';

export const SearchPane = <
  Item extends ItemBase,
  ItemList extends ItemListBase<Item>,
>({
  actionKeys,
  status,
  searchWord,
  itemList,
  selectedView,
  mode,
  dialog,
  setStatus,
  setSearchWord,
  setItemList,
  setSelectedView,
  setModifierKeys,
  updateItemList,
  ItemView,
}: Readonly<{
  actionKeys: ReadonlyArray<KeyDesc>;
  action?: Action;
  status?: Status;
  searchWord: string;
  itemList?: ItemList;
  selectedView: SelectedView;
  mode?: Mode;
  dialog?: Dialog;
  setStatus: (status?: Status) => void;
  setSearchWord: (word: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void;
  updateItemList: (args: UpdateItemListArgs<Item, ItemList>) => Promise<void>;
  ItemView: (args: ItemViewParms<Item>) => React.ReactElement;
}>): React.ReactElement => {
  const message = React.useMemo<React.ReactElement | undefined>(() => {
    switch (mode?.type) {
      case 'copy':
        return (
          <FormattedMessage
            id={messageId.copyHint}
            values={{ src: mode.source.map(_ => _.name).join(',') }}
          />
        );
      case 'rename':
        return (
          <FormattedMessage
            id={messageId.renameHint}
            values={{ src: mode.source.map(_ => _.name).join(',') }}
          />
        );
      default:
        return undefined;
    }
  }, [mode]);
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
        <SearchHint message={message} />;
        <SearchBox
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          setItemList={setItemList}
          setSelectedView={setSelectedView}
          updateItemList={updateItemList}
        />
        <ItemListView
          itemList={itemList}
          selectedView={selectedView}
          setSearchWord={setSearchWord}
          setSelectedView={setSelectedView}
          ItemView={ItemView}
        />
        <Dialog dialog={dialog} />
      </Box>
      <KeyboardHint actionKeys={actionKeys} />
      <Divider />
      <StatusBar status={status} setStatus={setStatus} />;
    </Box>
  );
};
