import { createRunLazy } from '@common/lazy-run';
import { Action, ActionKey, ModifierKeys } from '@core/action';
import { IntlError, IntlIdBase } from '@core/i18n';
import { keyEnter, keyY } from '@core/keyboard/keys';
import { Dialog } from '@core/store';
import { typeclass } from '@core/utils';
import React from 'react';

const runLazyArrowKey = createRunLazy({ duration: 30 });

const onArrowUp =
  <Item, ItemList>(itemListInstance: typeclass.ItemList<ItemList, Item>) =>
  ({
    event,
    itemList,
    selectedItemIndex,
    setSelectedItemIndex,
    updateSearchWord,
  }: Readonly<{
    event: KeyboardEvent;
    itemList?: ItemList;
    selectedItemIndex?: number;
    setSelectedItemIndex: (selectedItemIndex: number) => void;
    updateSearchWord?: (nextSelectedItemIndex?: number) => void;
  }>): void =>
    runLazyArrowKey(() => {
      event.preventDefault();
      event.stopPropagation();
      const nitems =
        itemList === undefined ? 0 : itemListInstance.getItems(itemList).length;

      const nextSelectedItemIndex =
        selectedItemIndex != null && selectedItemIndex > 0
          ? selectedItemIndex - 1
          : nitems - 1;

      setSelectedItemIndex(nextSelectedItemIndex);
      updateSearchWord?.(nextSelectedItemIndex);
    });

const onArrowDown =
  <Item, ItemList>(itemListInstance: typeclass.ItemList<ItemList, Item>) =>
  ({
    event,
    itemList,
    selectedItemIndex,
    setSelectedItemIndex,
    updateSearchWord,
  }: Readonly<{
    event: KeyboardEvent;
    itemList: ItemList | undefined;
    selectedItemIndex?: number;
    setSelectedItemIndex: (selectedItemIndex: number) => void;
    updateSearchWord?: (nextSelectedItemIndex: number) => void;
  }>): void =>
    runLazyArrowKey(() => {
      event.preventDefault();
      event.stopPropagation();
      const nitems =
        itemList === undefined ? 0 : itemListInstance.getItems(itemList).length;

      const nextSelectedItemIndex =
        selectedItemIndex != null && selectedItemIndex < nitems - 1
          ? selectedItemIndex + 1
          : 0;
      setSelectedItemIndex(nextSelectedItemIndex);
      updateSearchWord?.(nextSelectedItemIndex);
    });

const moveItems =
  <Item, ItemList>(
    itemInstance: typeclass.Item<Item>,
    itemListInstance: typeclass.ItemList<ItemList, Item>,
  ) =>
  (
    event: KeyboardEvent,
    {
      selectedItemIndex,
      itemList,
      setSelectedItemIndex,
      updateSearchWord,
    }: Readonly<{
      itemList?: ItemList;
      selectedItemIndex?: number;
      setSelectedItemIndex: (selectedItemIndex: number) => void;
      updateSearchWord?: (nextSelectedIndex?: number) => void;
    }>,
  ): void => {
    switch (event.code) {
      case 'ArrowUp':
        return onArrowUp(itemListInstance)({
          event,
          itemList,
          selectedItemIndex,
          setSelectedItemIndex,
          updateSearchWord,
        });
      case 'ArrowDown':
        return onArrowDown(itemListInstance)({
          event,
          itemList,
          selectedItemIndex,
          setSelectedItemIndex,
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
  dismissId,
  setDialog,
  setState,
  instances,
}: Readonly<{
  event: KeyboardEvent;
  actionKeys?: ReadonlyArray<ActionKey<State, IntlId>>;
  modifierKeys: ModifierKeys;
  defaultKeys: ReadonlyArray<ActionKey<State, IntlId>>;
  dialog?: Dialog<State, IntlId>;
  dismissId: IntlId;
  setDialog: (dialog?: Dialog<State, IntlId>) => void;
  setState: (state: Partial<State>) => void;
  instances: Readonly<{
    stateInstance: typeclass.State<State, IntlId>;
  }>;
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
      .then(_ => setState(_))
      .catch(err => {
        console.error(err);
        setDialog({
          type: 'error',
          title: err instanceof IntlError ? err.formattedMessage : String(err),
          lines: [],
          keys: [
            keyY<State, IntlId>({
              desc: { id: dismissId },
              run: async () => instances.stateInstance.fromDialog(undefined),
            }),
            keyEnter<State, IntlId>({
              desc: { id: dismissId },
              run: async () => instances.stateInstance.fromDialog(undefined),
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
  selectedItemIndex,
  modifierKeys,
  defaultKeys,
  dismissId,
  dialog,
  setState,
  setModifierKeys,
  setSelectedItemIndex,
  updateSearchWord,
  setDialog,
  instances: { itemInstance, itemListInstance, stateInstance },
}: Readonly<{
  state: State;
  action?: Action<State, IntlId>;
  itemList?: ItemList;
  selectedItemIndex?: number;
  modifierKeys: ModifierKeys;
  defaultKeys: ReadonlyArray<ActionKey<State, IntlId>>;
  dismissId: IntlId;
  dialog?: Dialog<State, IntlId>;
  setState: (state: Partial<State>) => void;
  setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void;
  setSelectedItemIndex: (selectedItemIndex: number) => void;
  updateSearchWord?: (nextSelectedItemIndex?: number) => void;
  setDialog: (dialog?: Dialog<State, IntlId>) => void;
  instances: Readonly<{
    itemInstance: typeclass.Item<Item>;
    itemListInstance: typeclass.ItemList<ItemList, Item>;
    stateInstance: typeclass.State<State, IntlId>;
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
          instances: { stateInstance },
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
          instances: { stateInstance },
        });
      }

      moveItems(itemInstance, itemListInstance)(event, {
        selectedItemIndex,
        itemList,
        setSelectedItemIndex,
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
    stateInstance,
    modifierKeys,
    setModifierKeys,
    action,
    itemList,
    selectedItemIndex,
    setSelectedItemIndex,
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
    selectedItemIndex?: number;
    modifierKeys: ModifierKeys;
    dialogKeys?: ReadonlyArray<ActionKey<State, IntlId>>;
    defaultKeys: ReadonlyArray<ActionKey<State, IntlId>>;
    dismissId: IntlId;
    dialog?: Dialog<State, IntlId>;
    setState: (state: Partial<State>) => void;
    setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void;
    setSelectedItemIndex: (selectedItemIndex: number) => void;
    updateSearchWord?: (nextSelectedItemIndex?: number) => void;
    setDialog: (dialog?: Dialog<State, IntlId>) => void;
    instances: Readonly<{
      itemInstance: typeclass.Item<Item>;
      itemListInstance: typeclass.ItemList<ItemList, Item>;
      stateInstance: typeclass.State<State, IntlId>;
    }>;
  }>,
) => {
  useKeyDownEvent(params);
  useKeyUpEvent(params);
};
