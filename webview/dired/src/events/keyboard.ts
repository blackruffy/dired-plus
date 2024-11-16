import {
  DiredItem as Item,
  DiredItemList as ItemList,
} from '@common/dired-item';
import { core } from '@core/index';
import { defaultKeys } from '@dired/action/keys';
import { MessageId, messageId } from '@dired/i18n/ja';
import {
  Action,
  SelectedView,
  State,
  stateInstance,
  useStore,
} from '@dired/store';
import { itemInstance, itemListInstance } from '@dired/utils/item-list';
import { pipe } from 'fp-ts/lib/function';

const updateSearchWord = (
  args: Readonly<{
    nextSelectedView: SelectedView;
    itemList: ItemList | undefined;
    separator?: string;
    setSearchWord: (searchWord: string) => void;
  }>,
): void => {
  if (args.nextSelectedView.name === 'list-item') {
    pipe(
      args.nextSelectedView.index,
      index => args.itemList?.items?.[index]?.path ?? null,
      nextSearchWord =>
        nextSearchWord == null ? void 0 : args.setSearchWord(nextSearchWord),
    );
  }
};

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
      updateSearchWord({
        nextSelectedView,
        itemList: state.itemList,
        separator: state.separator,
        setSearchWord: state.setSearchWord,
      }),
    setDialog: state.setDialog,
    setModifierKeys: state.setModifierKeys,
    instances: { itemInstance, itemListInstance, stateInstance },
  });
};
