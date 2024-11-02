import { SearchPane } from '@core/components/SearchPane';
import { updateItemList } from '@dired/action/helpers';
import { ItemView } from '@dired/components/DiredItemList';
import { messageId } from '@dired/i18n/ja';
import { Action, useStore } from '@dired/store';
import { itemInstance, itemListInstance } from '@dired/utils/item-list';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const Dired = ({
  action,
}: Readonly<{ action?: Action }>): React.ReactElement => {
  const state = useStore();

  const message = React.useMemo<React.ReactElement | undefined>(() => {
    switch (state.mode?.type) {
      case 'copy':
        return (
          <FormattedMessage
            id={messageId.copyHint}
            values={{ src: state.mode.source.map(_ => _.name).join(',') }}
          />
        );
      case 'rename':
        return (
          <FormattedMessage
            id={messageId.renameHint}
            values={{ src: state.mode.source.map(_ => _.name).join(',') }}
          />
        );
      default:
        return undefined;
    }
  }, [state.mode]);

  return (
    <SearchPane
      state={state}
      action={action}
      searchHintMessage={message}
      updateItemList={updateItemList}
      ItemView={ItemView}
      instances={{ itemInstance, itemListInstance }}
    />
  );
};
