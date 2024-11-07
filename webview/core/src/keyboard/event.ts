import { Action, ActionKey, ModifierKeys } from '@core/action';
import { IntlError, IntlIdBase } from '@core/i18n';
import { keyY } from '@core/keyboard/keys';
import { Dialog, SelectedView } from '@core/store';
import { typeclass } from '@core/utils';
import { identity } from 'fp-ts/lib/function';
import React from 'react';

const keyInterval = 30;

const onArrowUp =
  <Item, ItemList>(itemListInstance: typeclass.ItemList<ItemList, Item>) =>
  ({
    event,
    itemList,
    selectedView,
    setSelectedView,
    updateSearchWord,
  }: Readonly<{
    event: KeyboardEvent;
    itemList: ItemList | undefined;
    selectedView: SelectedView;
    setSelectedView: (selectedView: SelectedView) => void;
    updateSearchWord?: (nextSelectedView: SelectedView) => void;
  }>): void => {
    event.preventDefault();
    event.stopPropagation();
    const nitems =
      itemList === undefined ? 0 : itemListInstance.getItems(itemList).length;

    if (Date.now() - selectedView.updatedAt > keyInterval) {
      const nextSelectedView =
        selectedView.name === 'list-item' && selectedView.index > 0
          ? identity<SelectedView>({
              name: 'list-item',
              index: selectedView.index - 1,
              updatedAt: Date.now(),
            })
          : identity<SelectedView>({
              name: 'list-item',
              index: nitems - 1,
              updatedAt: Date.now(),
            });

      setSelectedView(nextSelectedView);

      updateSearchWord?.(nextSelectedView);
    }
  };

const onArrowDown =
  <Item, ItemList>(itemListInstance: typeclass.ItemList<ItemList, Item>) =>
  ({
    event,
    itemList,
    selectedView,
    setSelectedView,
    updateSearchWord,
  }: Readonly<{
    event: KeyboardEvent;
    itemList: ItemList | undefined;
    selectedView: SelectedView;
    setSelectedView: (selectedView: SelectedView) => void;
    updateSearchWord?: (nextSelectedView: SelectedView) => void;
  }>): void => {
    event.preventDefault();
    event.stopPropagation();
    const nitems =
      itemList === undefined ? 0 : itemListInstance.getItems(itemList).length;

    if (Date.now() - selectedView.updatedAt > keyInterval) {
      const nextSelectedView =
        selectedView.name === 'list-item' && selectedView.index < nitems - 1
          ? identity<SelectedView>({
              name: 'list-item',
              index: selectedView.index + 1,
              updatedAt: Date.now(),
            })
          : identity<SelectedView>({
              name: 'list-item',
              index: 0,
              updatedAt: Date.now(),
            });
      setSelectedView(nextSelectedView);

      updateSearchWord?.(nextSelectedView);
    }
  };

const moveItems =
  <Item, ItemList>(
    itemInstance: typeclass.Item<Item>,
    itemListInstance: typeclass.ItemList<ItemList, Item>,
  ) =>
  (
    event: KeyboardEvent,
    {
      selectedView,
      itemList,
      setSelectedView,
      updateSearchWord,
    }: Readonly<{
      itemList?: ItemList;
      selectedView: SelectedView;
      setSelectedView: (selectedView: SelectedView) => void;
      updateSearchWord?: (nextSelectedView: SelectedView) => void;
    }>,
  ): void => {
    switch (event.code) {
      case 'ArrowUp':
        return onArrowUp(itemListInstance)({
          event,
          itemList,
          selectedView,
          setSelectedView,
          updateSearchWord,
        });
      case 'ArrowDown':
        return onArrowDown(itemListInstance)({
          event,
          itemList,
          selectedView,
          setSelectedView,
          updateSearchWord,
        });
      default:
        return;
    }
  };

const updateModifierUp = (
  code: string,
  setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void,
) => {
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

const updateModifierDown = (
  code: string,
  setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void,
) => {
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

const getMatchedActionKey = <State, IntlId extends string>({
  actionKeys,
  modifierKeys,
  keyCode,
}: Readonly<{
  actionKeys?: ReadonlyArray<ActionKey<State, IntlId>>;
  modifierKeys: ModifierKeys;
  keyCode: string;
}>): ActionKey<State, IntlId> | undefined =>
  actionKeys?.find(
    _ =>
      Object.entries(_.modifierKeys).every(
        ([k, v]) => modifierKeys[k as keyof ModifierKeys] === v,
      ) && _.code === keyCode,
  );

const runAction = <State, IntlId extends IntlIdBase>({
  event,
  actionKeys,
  modifierKeys,
  defaultKeys,
  dismissId,
  dialog,
  setDialog,
  setState,
}: Readonly<{
  event: KeyboardEvent;
  actionKeys?: ReadonlyArray<ActionKey<State, IntlId>>;
  modifierKeys: ModifierKeys;
  defaultKeys: ReadonlyArray<ActionKey<State, IntlId>>;
  dialog?: Dialog<State, IntlId>;
  dismissId: IntlId;
  setDialog: (dialog?: Dialog<State, IntlId>) => void;
  setState: (state: Partial<State>) => void;
}>): void => {
  const actionKey = getMatchedActionKey({
    actionKeys,
    modifierKeys,
    keyCode: event.code,
  });

  console.log(
    `Key down: ${event.code}, ${JSON.stringify(modifierKeys)}, actionKey: ${JSON.stringify(actionKey?.desc)}`,
  );

  if (actionKey === undefined) {
    return;
  } else {
    event.preventDefault();
    event.stopPropagation();
    actionKey
      .run()
      .then(_ => {
        if (dialog !== undefined) {
          setDialog({
            ...dialog,
            keys: [...dialog.keys, ...defaultKeys],
          });
        }
        setState(_);
      })
      .catch(err => {
        console.error(err);
        setDialog({
          type: 'error',
          title: err instanceof IntlError ? err.formattedMessage : String(err),
          lines: [],
          keys: [
            keyY<State, IntlId>({
              desc: { id: dismissId },
              run: async () => {
                setDialog(undefined);
                return {};
              },
            }),
          ],
        });
      });
  }
};

export const useKeyDownEvent = <State, IntlId extends string, Item, ItemList>({
  state,
  action,
  itemList,
  selectedView,
  modifierKeys,
  defaultKeys,
  dismissId,
  dialog,
  setState,
  setModifierKeys,
  setSelectedView,
  updateSearchWord,
  setDialog,
  instances: { itemInstance, itemListInstance },
}: Readonly<{
  state: State;
  action?: Action<State, IntlId>;
  itemList?: ItemList;
  selectedView: SelectedView;
  modifierKeys: ModifierKeys;
  defaultKeys: ReadonlyArray<ActionKey<State, IntlId>>;
  dismissId: IntlId;
  dialog?: Dialog<State, IntlId>;
  setState: (state: Partial<State>) => void;
  setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  updateSearchWord?: (nextSelectedView: SelectedView) => void;
  setDialog: (dialog?: Dialog<State, IntlId>) => void;
  instances: Readonly<{
    itemInstance: typeclass.Item<Item>;
    itemListInstance: typeclass.ItemList<ItemList, Item>;
  }>;
}>) => {
  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (modifierKeys.metaKey && event.code === 'KeyX') {
        updateModifierUp('MetaLeft', setModifierKeys);
        updateModifierUp('MetaRight', setModifierKeys);
      } else if (dialog !== undefined) {
        runAction<State, IntlId>({
          event,
          actionKeys: dialog.keys,
          modifierKeys,
          defaultKeys,
          dismissId,
          dialog,
          setState,
          setDialog,
        });
      } else if (action !== undefined) {
        runAction<State, IntlId>({
          event,
          actionKeys: action.keys,
          modifierKeys,
          defaultKeys,
          dismissId,
          dialog,
          setState,
          setDialog,
        });
      }

      moveItems(itemInstance, itemListInstance)(event, {
        selectedView,
        itemList,
        setSelectedView,
        updateSearchWord,
      });
      updateModifierDown(event.code, setModifierKeys);
    };

    window.addEventListener('keydown', callback);
    return () => {
      window.removeEventListener('keydown', callback);
    };
  }, [
    itemInstance,
    itemListInstance,
    modifierKeys,
    setModifierKeys,
    action,
    itemList,
    selectedView,
    setSelectedView,
    updateSearchWord,
    defaultKeys,
    dismissId,
    setState,
    state,
    dialog,
    setDialog,
  ]);
};

export const useKeyUpEvent = ({
  setModifierKeys,
}: Readonly<{
  setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void;
}>) => {
  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      updateModifierUp(event.code, setModifierKeys);
    };

    window.addEventListener('keyup', callback);
    return () => {
      window.removeEventListener('keyup', callback);
    };
  }, [setModifierKeys]);
};

export const useKeyboardEvent = <
  State,
  IntlId extends IntlIdBase,
  Item,
  ItemList,
>(
  params: Readonly<{
    state: State;
    action?: Action<State, IntlId>;
    itemList?: ItemList;
    selectedView: SelectedView;
    modifierKeys: ModifierKeys;
    dialogKeys?: ReadonlyArray<ActionKey<State, IntlId>>;
    defaultKeys: ReadonlyArray<ActionKey<State, IntlId>>;
    dismissId: IntlId;
    dialog?: Dialog<State, IntlId>;
    setState: (state: Partial<State>) => void;
    setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void;
    setSelectedView: (selectedView: SelectedView) => void;
    updateSearchWord?: (nextSelectedView: SelectedView) => void;
    setDialog: (dialog?: Dialog<State, IntlId>) => void;
    instances: Readonly<{
      itemInstance: typeclass.Item<Item>;
      itemListInstance: typeclass.ItemList<ItemList, Item>;
    }>;
  }>,
) => {
  useKeyDownEvent(params);
  useKeyUpEvent(params);
};
