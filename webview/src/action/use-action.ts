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
    separator,
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
    } else if (itemList?.parent.itemType !== 'none' && mode?.type === 'copy') {
      return searchBoxIsItemCopy({
        item: itemList.parent,
        itemList,
        source: mode.source,
        selectedView,
        separator: separator ?? '/',
        setMode,
        setSearchWord,
        setItemList,
        setSelectedView,
      });
    } else if (
      itemList?.parent.itemType !== 'none' &&
      mode?.type === 'rename'
    ) {
      return searchBoxIsItemRename({
        item: itemList.parent,
        itemList,
        source: mode.source,
        selectedView,
        separator: separator ?? '/',
        setMode,
        setSearchWord,
        setItemList,
        setSelectedView,
      });
    } else if (itemList?.parent.itemType === 'none' && mode?.type === 'copy') {
      return searchBoxIsNoneCopy({
        item: itemList.parent,
        itemList,
        source: mode.source,
        selectedView,
        separator: separator ?? '/',
        setMode,
        setSearchWord,
        setItemList,
        setSelectedView,
      });
    } else if (
      itemList?.parent.itemType === 'none' &&
      mode?.type === 'rename'
    ) {
      return searchBoxIsNoneRename({
        item: itemList.parent,
        itemList,
        source: mode.source,
        selectedView,
        separator: separator ?? '/',
        setMode,
        setSearchWord,
        setItemList,
        setSelectedView,
      });
    } else if (itemList?.parent.itemType === 'none' && mode === undefined) {
      return searchBoxIsNoneDefault({
        path: itemList.parent.path,
        itemList,
        selectedView,
        separator: separator ?? '/',
        setItemList,
        setSearchWord,
        setSelectedView,
      });
    } else if (itemList?.parent.itemType !== 'none' && mode === undefined) {
      return searchBoxIsItemDefault({
        item: itemList.parent,
        itemList,
        selectedView,
        checked,
        separator: separator ?? '/',
        setMode,
        setItemList,
        setSearchWord,
        setSelectedView,
        setChecked,
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
        separator: separator ?? '/',
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
        separator: separator ?? '/',
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
        separator: separator ?? '/',
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
