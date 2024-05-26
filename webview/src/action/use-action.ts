import { Action, ok, useStore } from '@src/store';
import { itemListIsItemCopy } from './item-list/is-item.copy';
import { itemListIsItemDefault } from './item-list/is-item.default';
import { itemListIsItemRename } from './item-list/is-item.rename';
import { keyO } from './keys';
import { searchBoxIsItemCopy } from './search-box/is-item.copy';
import { searchBoxIsItemDefault } from './search-box/is-item.default';
import { searchBoxIsItemRename } from './search-box/is-item.rename';
import { searchBoxIsNoneCopy } from './search-box/is-none.copy';
import { searchBoxIsNoneDefault } from './search-box/is-none.default';
import { searchBoxIsNoneRename } from './search-box/is-none.rename';

export const useAction = (): Action | undefined => {
  const {
    selectedView,
    itemList,
    mode,
    setMode,
    setSearchWord,
    setItemList,
    checked,
    setChecked,
    setSelectedView,
  } = useStore();

  if (mode?.type === 'error') {
    return {
      id: 'error',
      title: mode.message,
      themeColor: 'warning',
      keys: [
        keyO({
          desc: 'OK',
          run: async () => {
            setMode();
            return ok();
          },
        }),
      ],
    };
  } else if (mode?.type === 'confirm') {
    return mode.action;
  } else if (selectedView.name === 'search-box') {
    if (itemList === undefined) {
      return undefined;
    } else if (itemList?.itemType !== 'none' && mode?.type === 'copy') {
      return searchBoxIsItemCopy({
        path: itemList.path,
        itemType: itemList.itemType,
        source: mode.source,
        setMode,
        setSearchWord,
        setItemList,
      });
    } else if (itemList?.itemType !== 'none' && mode?.type === 'rename') {
      return searchBoxIsItemRename({
        path: itemList.path,
        itemType: itemList.itemType,
        source: mode.source,
        setMode,
        setSearchWord,
        setItemList,
      });
    } else if (itemList?.itemType === 'none' && mode?.type === 'copy') {
      return searchBoxIsNoneCopy({
        path: itemList.path,
        source: mode.source,
        setMode,
        setSearchWord,
        setItemList,
      });
    } else if (itemList?.itemType === 'none' && mode?.type === 'rename') {
      return searchBoxIsNoneRename({
        path: itemList.path,
        source: mode.source,
        setMode,
        setSearchWord,
        setItemList,
      });
    } else if (itemList?.itemType === 'none' && mode === undefined) {
      return searchBoxIsNoneDefault({
        path: itemList.path,
        setItemList,
        setSearchWord,
        setSelectedView,
      });
    } else if (itemList?.itemType !== 'none' && mode === undefined) {
      return searchBoxIsItemDefault({
        path: itemList.path,
        setItemList,
        setSearchWord,
        setSelectedView,
      });
    } else {
      return undefined;
    }
  } else if (selectedView.name === 'list-item') {
    const item = itemList?.items[selectedView.index];
    const itemType = item?.itemType;
    if (itemType !== 'none' && mode?.type === undefined && item !== undefined) {
      return itemListIsItemDefault({
        index: selectedView.index,
        item,
        itemList,
        setMode,
        setSearchWord,
        setItemList,
        checked,
        setChecked,
        setSelectedView,
      });
    } else if (
      itemType !== 'none' &&
      mode?.type === 'copy' &&
      item !== undefined
    ) {
      return itemListIsItemCopy({
        destination: item,
        source: mode.source,
        setMode,
        setSelectedView,
        setSearchWord,
        setItemList,
      });
    } else if (
      itemType !== 'none' &&
      mode?.type === 'rename' &&
      item !== undefined
    ) {
      return itemListIsItemRename({
        destination: item,
        source: mode.source,
        setMode,
        setSelectedView,
        setSearchWord,
        setItemList,
      });
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};
