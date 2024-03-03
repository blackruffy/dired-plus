import { ItemList } from '@common/messages';
import { openFile, updateItemList } from '@src/events/native';
import { SelectedView, useStore } from '@src/store';
import React from 'react';

const keyInterval = 50;

const onArrowUp = (
  event: KeyboardEvent,
  nitems: number,
  selectedView: SelectedView,
  setSelectedView: (selectedView: SelectedView) => void,
): void => {
  event.preventDefault();
  event.stopPropagation();
  if (Date.now() - selectedView.updatedAt > keyInterval) {
    setSelectedView(
      selectedView.name === 'list-item' && selectedView.index > 0
        ? {
            name: 'list-item',
            index: selectedView.index - 1,
            updatedAt: Date.now(),
          }
        : selectedView.name === 'list-item'
          ? {
              name: 'search-box',
              updatedAt: Date.now(),
            }
          : { name: 'list-item', index: nitems - 1, updatedAt: Date.now() },
    );
  }
};

const onArrowDown = (
  event: KeyboardEvent,
  nitems: number,
  selectedView: SelectedView,
  setSelectedView: (selectedView: SelectedView) => void,
): void => {
  event.preventDefault();
  event.stopPropagation();

  if (Date.now() - selectedView.updatedAt > keyInterval) {
    setSelectedView(
      selectedView.name === 'list-item' && selectedView.index < nitems - 1
        ? {
            name: 'list-item',
            index: selectedView.index + 1,
            updatedAt: Date.now(),
          }
        : selectedView.name === 'list-item'
          ? {
              name: 'search-box',
              updatedAt: Date.now(),
            }
          : {
              name: 'list-item',
              index: 0,
              updatedAt: Date.now(),
            },
    );
  }
};

const onSpace = (
  event: KeyboardEvent,
  selectedView: SelectedView,
  checked: Readonly<{ [key: number]: boolean }>,
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void,
) => {
  if (selectedView.name === 'list-item') {
    event.preventDefault();
    event.stopPropagation();
    setChecked({
      ...checked,
      [selectedView.index]:
        checked[selectedView.index] === undefined
          ? true
          : !checked[selectedView.index],
    });
  }
};

const onEnter = async (
  event: KeyboardEvent,
  selectedView: SelectedView,
  itemList: ItemList,
  setSearchWord: (searchWord: string) => void,
  setItemList: (itemList: ItemList) => void,
) => {
  if (selectedView.name === 'list-item') {
    event.preventDefault();
    event.stopPropagation();
    const item = itemList.items[selectedView.index];
    if (item.type === 'file') {
      openFile(item.path);
    } else {
      updateItemList({
        path: item.path,
        setSearchWord,
        setItemList,
      });
    }
  }
};

export const useKeyboardEvent = () => {
  const {
    itemList,
    selectedView,
    checked,
    setSearchWord,
    setItemList,
    setSelectedView,
    setChecked,
  } = useStore();

  const nitems = itemList === undefined ? 0 : itemList.items.length;

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      console.log('########### KEY:', event.key, event.code);
      switch (event.code) {
        case 'ArrowUp':
          return onArrowUp(event, nitems, selectedView, setSelectedView);
        case 'ArrowDown':
          return onArrowDown(event, nitems, selectedView, setSelectedView);
        case 'Space':
          return onSpace(event, selectedView, checked, setChecked);
        case 'Enter':
          if (itemList !== undefined) {
            return onEnter(
              event,
              selectedView,
              itemList,
              setSearchWord,
              setItemList,
            );
          }
        // default:
        //   return scope(async () =>
        //     setItemList(
        //       await listItems(
        //         itemList?.path === undefined
        //           ? event.key
        //           : `${itemList.path}${event.key}`,
        //       ),
        //     ),
        //   );
      }
    };

    window.addEventListener('keydown', callback);
    return () => {
      window.removeEventListener('keydown', callback);
    };
  }, [
    nitems,
    itemList,
    selectedView,
    checked,
    setSelectedView,
    setChecked,
    setItemList,
    setSearchWord,
  ]);
};
