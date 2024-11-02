import { core } from '@core/index';
import { Action, ActionKey } from '@history/action/use-action';
import { MessageId, messageId } from '@history/i18n/ja';
import { Item, ItemList, State, useStore } from '@history/store';
import { itemInstance, itemListInstance } from '@history/utils/item-list';

export const defaultKeys: ReadonlyArray<ActionKey> =
  core.keyboard.keys.defaultKeys(
    messageId.quit,
    messageId.nextPage,
    messageId.prevPage,
  );

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
    setDialog: state.setDialog,
    setModifierKeys: state.setModifierKeys,
    instances: { itemInstance, itemListInstance },
  });
};
