import {
  Action,
  ModifierKeys,
  SelectedView,
  State,
  useStore,
} from '@src/store';
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

// const onSpace = (
//   event: KeyboardEvent,
//   selectedView: SelectedView,
//   checked: Readonly<{ [key: number]: boolean }>,
//   setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void,
// ) => {
//   if (selectedView.name === 'list-item') {
//     event.preventDefault();
//     event.stopPropagation();
//     setChecked({
//       ...checked,
//       [selectedView.index]:
//         checked[selectedView.index] === undefined
//           ? true
//           : !checked[selectedView.index],
//     });
//   }
// };

// const onEnter = async (
//   event: KeyboardEvent,
//   shiftKey: boolean,
//   searchWord: string,
//   selectedView: SelectedView,
//   itemList: ItemList | undefined,
//   setSearchWord: (searchWord: string) => void,
//   setItemList: (itemList: ItemList) => void,
// ): Promise<void> => {
//   if (isCreateFileOrDirectoryMode(selectedView, itemList)) {
//     event.preventDefault();
//     event.stopPropagation();
//     if (shiftKey) {
//       await createDirectory(searchWord);
//     } else {
//       await createFile(searchWord);
//       setSearchWord('');
//     }
//   } else if (isFileActionMode(selectedView, itemList)) {
//     // open a file or change a directory
//     event.preventDefault();
//     event.stopPropagation();
//     const item = (itemList as ItemList).items[(selectedView as ListItem).index];
//     await openFile(item.path);
//     setSearchWord('');
//   } else if (isDirectoryActionMode(selectedView, itemList)) {
//     event.preventDefault();
//     event.stopPropagation();
//     const item = (itemList as ItemList).items[(selectedView as ListItem).index];
//     await updateItemList({
//       path: item.path,
//       setSearchWord,
//       setItemList,
//     });
//   }
// };

// const onKeyD = async (
//   event: KeyboardEvent,
//   selectedView: SelectedView,
//   itemList: ItemList | undefined,
//   setConfirm: (confirm: Confirm) => void,
// ): Promise<void> => {
//   if (isFileActionMode(selectedView, itemList)) {
//     event.preventDefault();
//     event.stopPropagation();
//     const item = (itemList as ItemList).items[(selectedView as ListItem).index];
//     setConfirm({ command: 'delete-file', path: item.path });
//   } else if (isDirectoryActionMode(selectedView, itemList)) {
//     event.preventDefault();
//     event.stopPropagation();
//     const item = (itemList as ItemList).items[(selectedView as ListItem).index];
//     setConfirm({ command: 'delete-directory', path: item.path });
//   }
// };

// const onKeyY = async (
//   event: KeyboardEvent,
//   confirm: Confirm | undefined,
//   setConfirm: (confirm?: Confirm) => void,
// ): Promise<void> => {
//   if (confirm?.command === 'delete-file') {
//     event.preventDefault();
//     event.stopPropagation();
//     setConfirm(undefined);
//     await deleteFile(confirm.path);
//   } else if (confirm?.command === 'delete-directory') {
//     event.preventDefault();
//     event.stopPropagation();
//     setConfirm(undefined);
//     await deleteDirectory(confirm.path);
//   }
// };

const moveItems = (
  event: KeyboardEvent,
  { selectedView, itemList, setSelectedView }: State,
): void => {
  const nitems = itemList === undefined ? 0 : itemList.items.length;
  switch (event.code) {
    case 'ArrowUp':
      return onArrowUp(event, nitems, selectedView, setSelectedView);
    case 'ArrowDown':
      return onArrowDown(event, nitems, selectedView, setSelectedView);
    default:
      return;
  }
};

const updateModifierDown = (code: string, { setModifierKeys }: State) => {
  switch (code) {
    case 'ShiftLeft':
    case 'ShiftRight':
      return setModifierKeys({ shiftKey: true });
    case 'ControlLeft':
    case 'ControlRight':
      return setModifierKeys({ controlKey: true });
    case 'AltLeft':
    case 'AltRight':
      return setModifierKeys({ altKey: true });
    case 'MetaLeft':
    case 'MetaRight':
      return setModifierKeys({ metaKey: true });
    default:
      return;
  }
};

const updateModifierUp = (code: string, { setModifierKeys }: State) => {
  switch (code) {
    case 'ShiftLeft':
    case 'ShiftRight':
      return setModifierKeys({ shiftKey: false });
    case 'ControlLeft':
    case 'ControlRight':
      return setModifierKeys({ controlKey: false });
    case 'AltLeft':
    case 'AltRight':
      return setModifierKeys({ altKey: false });
    case 'MetaLeft':
    case 'MetaRight':
      return setModifierKeys({ metaKey: false });
  }
};

export const useKeyDownEvent = (action?: Action) => {
  const state = useStore();
  const { modifierKeys, setModifierKeys } = state;

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      action?.keys
        ?.find(
          ({ keyEvent }) =>
            Object.entries(keyEvent.modifierKeys ?? {}).every(
              ([k, v]) => modifierKeys[k as keyof ModifierKeys] === v,
            ) && keyEvent.code === event.code,
        )
        ?.keyEvent.run();

      moveItems(event, state);
      updateModifierDown(event.code, state);

      console.log('########### KEY:', event.key, event.code);
      //   switch (event.code) {
      //     case 'Space':
      //       return onSpace(event, selectedView, checked, setChecked);
      //     case 'Enter':
      //       return onEnter(
      //         event,
      //         shiftKey,
      //         searchWord,
      //         selectedView,
      //         itemList,
      //         setSearchWord,
      //         setItemList,
      //       );
      //     case 'KeyD':
      //       return onKeyD(event, selectedView, itemList, setConfirm);
      //     case 'KeyY':
      //       return onKeyY(event, confirm, setConfirm);
      //     // default:
      //     //   return scope(async () =>
      //     //     setItemList(
      //     //       await listItems(
      //     //         itemList?.path === undefined
      //     //           ? event.key
      //     //           : `${itemList.path}${event.key}`,
      //     //       ),
      //     //     ),
      //     //   );
      //   }
    };

    window.addEventListener('keydown', callback);
    return () => {
      window.removeEventListener('keydown', callback);
    };
  }, [modifierKeys, setModifierKeys, action, state]);
};

export const useKeyUpEvent = () => {
  const state = useStore();

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      updateModifierUp(event.code, state);
    };

    window.addEventListener('keyup', callback);
    return () => {
      window.removeEventListener('keyup', callback);
    };
  }, [state]);
};

export const useKeyboardEvent = (action?: Action) => {
  useKeyDownEvent(action);
  useKeyUpEvent();
};
