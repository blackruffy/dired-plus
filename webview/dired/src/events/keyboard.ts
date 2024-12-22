import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import { core } from '@core/index';
import { defaultKeys } from '@dired/action/keys';
import { MessageId, messageId } from '@dired/i18n/ja';
import { Action, State, stateInstance, useStore } from '@dired/store';
import { itemInstance, itemListInstance } from '@dired/utils/item-list';
import { pipe } from 'fp-ts/lib/function';

const updateSearchWord = (
  args: Readonly<{
    nextSelectedItemIndex?: number;
    itemList: ItemList | undefined;
    separator?: string;
    setSearchWord: (searchWord: string) => void;
  }>,
): void => {
  pipe(
    args.nextSelectedItemIndex,
    index =>
      index == null ? null : args.itemList?.items?.[index]?.path ?? null,
    nextSearchWord =>
      nextSearchWord == null ? void 0 : args.setSearchWord(nextSearchWord),
  );
};

export const useKeyboardEvent = (params: Readonly<{ action?: Action }>) => {
  const state = useStore();
  core.keyboard.event.useKeyboardEvent<State, MessageId, Item, ItemList>({
    action: params.action,
    modifierKeys: state.modifierKeys,
    state,
    itemList: state.itemList,
    selectedItemIndex: state.selectedItemIndex,
    defaultKeys,
    dismissId: messageId.dismiss,
    quitId: messageId.quit,
    dialog: state.dialog,
    setState: state.setState,
    setSelectedItemIndex: state.setSelectedItemIndex,
    updateSearchWord: nextSelectedItemIndex =>
      updateSearchWord({
        nextSelectedItemIndex,
        itemList: state.itemList,
        separator: state.separator,
        setSearchWord: state.setSearchWord,
      }),
    setDialog: state.setDialog,
    setModifierKeys: state.setModifierKeys,
    instances: { itemInstance, itemListInstance, stateInstance },
  });
};
