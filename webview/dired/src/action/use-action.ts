import { DiredItem } from '@common/dired-item';
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
import { getBaseName } from './helpers';
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
  const item: DiredItem | null = pipe(
    selectedItemIndex == null ? null : itemList?.items[selectedItemIndex],
    _ =>
      _ == null
        ? {
            name: getBaseName(searchWord, separator ?? '/'),
            path: searchWord,
            itemType: 'none',
          }
        : _,
  );
  // const itemType = item?.itemType ?? 'none';
  // if (itemType !== 'none' && mode?.type === 'copy' && item !== undefined) {
  if (mode?.type === 'copy') {
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
    // } else if (
    //   itemType !== 'none' &&
    //   mode?.type === 'rename' &&
    //   item !== undefined
  } else if (mode?.type === 'rename') {
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
