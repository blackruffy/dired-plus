import { useMessages } from '@dired/i18n';
import {
  Action,
  ActionKey,
  ActionWithNullableKeys,
  State,
  useStore,
} from '@dired/store';
import { ord, readonlyArray, string } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { itemListIsItemCopy } from './item-list/is-item.copy';
import { itemListIsItemDefault } from './item-list/is-item.default';
import { itemListIsItemRename } from './item-list/is-item.rename';
import { defaultKeys } from './keys';

const createAction = ({
  searchWord,
  selectedItemIndex,
  itemList,
  mode,
  separator,
  setMode,
  setSearchWord,
  setSearchBox,
  setItemList,
  checked,
  setChecked,
  setSelectedItemIndex,
}: State): ActionWithNullableKeys | undefined => {
  const item =
    selectedItemIndex == null ? undefined : itemList?.items[selectedItemIndex];
  const itemType = item?.itemType;
  if (itemType !== 'none' && mode?.type === 'copy' && item !== undefined) {
    return itemListIsItemCopy({
      searchWord,
      itemList,
      selectedItemIndex,
      destination: item,
      source: mode.source,
      separator: separator ?? '/',
      setMode,
      setSelectedItemIndex,
      setSearchWord,
      setSearchBox,
      setItemList,
    });
  } else if (
    itemType !== 'none' &&
    mode?.type === 'rename' &&
    item !== undefined
  ) {
    return itemListIsItemRename({
      searchWord,
      itemList,
      selectedItemIndex,
      destination: item,
      source: mode.source,
      separator: separator ?? '/',
      setMode,
      setSelectedItemIndex,
      setSearchWord,
      setSearchBox,
      setItemList,
    });
  } else {
    return itemListIsItemDefault({
      index: selectedItemIndex,
      searchWord,
      item,
      itemList,
      selectedItemIndex,
      separator: separator ?? '/',
      setMode,
      setSearchWord,
      setSearchBox,
      setItemList,
      checked,
      setChecked,
      setSelectedItemIndex,
    });
  }
};

export const useAction = (): Action | undefined => {
  const store = useStore();
  const action = createAction(store);
  const messages = useMessages(store.locale);

  return action === undefined
    ? undefined
    : {
        ...action,
        keys: pipe(
          [
            ...(action.keys.filter(_ => _ != null) as readonly ActionKey[]),
            ...defaultKeys,
          ],
          readonlyArray.sort<ActionKey>(
            ord.fromCompare((a: ActionKey, b: ActionKey) =>
              string.Ord.compare(messages[a.desc.id], messages[b.desc.id]),
            ),
          ),
        ),
      };
};
