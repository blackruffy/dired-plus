import { ItemList } from '@common/messages';
import { create } from 'zustand';

export type State = Readonly<{
  searchWord: string;
  itemList?: ItemList;
  selectedView: SelectedView;
  checked: Readonly<{ [key: number]: boolean }>;
  mode?: Mode;
  modifierKeys: ModifierKeys;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
  setMode: (mode?: Mode) => void;
  setModifierKeys: (modifierKeys: ModifierKeys) => void;
}>;

export type SelectedView = SearchBox | ListItem;

export type SearchBox = Readonly<{ name: 'search-box'; updatedAt: number }>;
export type ListItem = Readonly<{
  name: 'list-item';
  index: number;
  updatedAt: number;
}>;

export type ModifierKeys = Readonly<{
  shiftKey?: boolean;
  controlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
}>;

export type ActionKey = Readonly<{
  name: string;
  desc: string;
  keyEvent: KeyEvent;
}>;

export type KeyEvent = Readonly<{
  modifierKeys?: ModifierKeys;
  code: string;
  run: () => void;
}>;

export type Mode = ConfirmMode | CopyMode | RenameMode;

export type ConfirmMode = Readonly<{
  type: 'confirm';
  action: Action;
}>;

export type CopyMode = Readonly<{
  type: 'copy';
  source?: string;
}>;

export type RenameMode = Readonly<{
  type: 'rename';
  source?: string;
}>;

export type Action = Readonly<{
  title: string;
  themeColor?: 'normal' | 'warning';
  keys: ReadonlyArray<ActionKey>;
}>;

export const useStore = create<State>(set => ({
  searchWord: '',
  selectedView: { name: 'search-box', updatedAt: 0 },
  checked: {},
  modifierKeys: {
    shiftKey: false,
    controlKey: false,
    metaKey: false,
    altKey: false,
  },
  setSearchWord: searchWord => set(() => ({ searchWord })),
  setItemList: itemList => set(() => ({ itemList })),
  setSelectedView: selectedView => set(() => ({ selectedView })),
  setChecked: checked => set(() => ({ checked })),
  setMode: mode => set(() => ({ mode })),
  setModifierKeys: modifierKeys => set(() => ({ modifierKeys })),
}));
