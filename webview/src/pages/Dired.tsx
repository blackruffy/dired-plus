import { Box, Divider } from '@mui/material';
import { updateItemList } from '@src/action/helpers';
import { Dialog } from '@src/components/Dialog';
import { ItemView } from '@src/components/DiredItemList';
import { ItemListView } from '@src/components/ItemListView';
import { KeyboardHint } from '@src/components/KeyboardHint';
import { SearchBox } from '@src/components/SearchBox';
import { SearchHint } from '@src/components/SearchHint';
import { StatusBar } from '@src/components/StatusBar';
import { messageId } from '@src/i18n/ja';
import { Action, useStore } from '@src/store';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const Dired = ({
  action,
}: Readonly<{ action?: Action }>): React.ReactElement => {
  const {
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
  } = useStore();

  const actionKeys = dialog?.keys ?? action?.keys ?? [];
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
          setItemList={itemList => setItemList(itemList)}
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
