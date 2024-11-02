import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import { core } from '@core/index';
import { updateSearchWord } from '@core/keyboard/event';
import { defaultKeys } from '@dired/action/keys';
import { MessageId, messageId } from '@dired/i18n/ja';
import { Action, State, useStore } from '@dired/store';
import { itemInstance, itemListInstance } from '@dired/utils/item-list';

export const useKeyboardEvent = (params: Readonly<{ action?: Action }>) => {
  const state = useStore();
  core.keyboard.event.useKeyboardEvent<State, MessageId, Item, ItemList>({
    action: params.action,
    modifierKeys: state.modifierKeys,
    state,
    itemList: state.itemList,
    selectedView: state.selectedView,
    defaultKeys,
    dismissId: messageId.dismiss,
    dialog: state.dialog,
    setState: state.setState,
    setSelectedView: state.setSelectedView,
    updateSearchWord: nextSelectedView =>
      updateSearchWord(
        itemInstance,
        itemListInstance,
      )({
        nextSelectedView,
        itemList: state.itemList,
        setSearchWord: state.setSearchWord,
      }),
    setDialog: state.setDialog,
    setModifierKeys: state.setModifierKeys,
    instances: { itemInstance, itemListInstance },
  });
};
