import { Item, ItemList } from '@common/item';
import { create } from 'zustand';

export type State = Readonly<{
  // status?: Status;
  searchWord: string;
  itemList?: ItemList;
  selectedView: SelectedView;
  checked: Readonly<{ [key: number]: boolean }>;
  mode?: Mode;
  modifierKeys: ModifierKeys;
  separator?: string;
  // setStatus: (status?: Status) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
  setMode: (mode?: Mode) => void;
  setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void;
  setSeparator: (separator: string) => void;
}>;

// export type Status = Readonly<{
//   message: string;
//   type: 'none' | 'info' | 'success' | 'warning' | 'error';
// }>;

export type SelectedView = SearchBox | ListItem;

export type SearchBox = Readonly<{
  name: 'search-box';
  selectionStart?: number;
  selectionEnd?: number;
  itemIndex?: number;
  updatedAt: number;
}>;
export type ListItem = Readonly<{
  name: 'list-item';
  index: number;
  updatedAt: number;
}>;

export type ModifierKeys = Readonly<{
  shiftKey: boolean;
  controlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}>;

export type ActionKey = Readonly<{
  name: string;
  desc: string;
  modifierKeys: ModifierKeys;
  code: string;
  run: () => Promise<Ok>;
}>;

export type Ok = Readonly<{ message?: string }>;

export type Mode = ConfirmMode | CopyMode | RenameMode | ErrorMode;

export type ConfirmMode = Readonly<{
  type: 'confirm';
  action: Action;
}>;

export type CopyMode = Readonly<{
  type: 'copy';
  source: ReadonlyArray<Item>;
}>;

export type RenameMode = Readonly<{
  type: 'rename';
  source: ReadonlyArray<Item>;
}>;

export type ErrorMode = Readonly<{
  type: 'error';
  message: string;
}>;

export type Action = Readonly<{
  id: string;
  title: string;
  themeColor?: 'normal' | 'warning';
  keys: ReadonlyArray<ActionKey>;
}>;

export const toModifierKeys = (
  params: Partial<ModifierKeys> = {},
): ModifierKeys => ({
  shiftKey: false,
  controlKey: false,
  metaKey: false,
  altKey: false,
  ...params,
});

export const ok = (message?: string): Ok => ({ message });

export const useStore = create<State>(set => ({
  searchWord: '',
  selectedView: {
    name: 'search-box',
    updatedAt: 0,
  },
  checked: {},
  modifierKeys: toModifierKeys(),
  // setStatus: status => set(() => ({ status })),
  setSearchWord: searchWord => set(() => ({ searchWord })),
  setItemList: itemList => set(() => ({ itemList })),
  setSelectedView: selectedView => set(() => ({ selectedView })),
  setChecked: checked => set(() => ({ checked })),
  setMode: mode => set(() => ({ mode })),
  setModifierKeys: modifierKeys =>
    set(() => ({ modifierKeys: toModifierKeys(modifierKeys) })),
  setSeparator: separator => set(() => ({ separator })),
}));
