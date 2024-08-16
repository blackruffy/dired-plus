import { Item, ItemList } from '@common/item';
import { ColorTheme } from '@common/theme-color';
import { IntlMessage } from '@src/i18n';
import { create } from 'zustand';

export type State = Readonly<{
  status?: Status;
  searchWord: string;
  itemList?: ItemList;
  selectedView: SelectedView;
  checked: Readonly<{ [key: number]: boolean }>;
  mode?: Mode;
  modifierKeys: ModifierKeys;
  separator?: string;
  dialog?: Dialog;
  colorTheme: ColorTheme;
  locale: string;
  setState: (state: Partial<State>) => void;
  setStatus: (status?: Status) => void;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
  setMode: (mode?: Mode) => void;
  setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void;
  setSeparator: (separator: string) => void;
  setDialog: (dialog?: Dialog) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  setLocale: (locale: string) => void;
}>;

export type StatusType =
  | 'none'
  | 'info'
  | 'confirm'
  | 'success'
  | 'warning'
  | 'error';

export type Status = Readonly<{
  message: IntlMessage;
  type: StatusType;
}>;

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
  desc: IntlMessage;
  modifierKeys: ModifierKeys;
  code: string;
  run: () => Promise<Partial<State>>;
}>;

export type Mode = CopyMode | RenameMode;

// export type ConfirmMode = Readonly<{
//   type: 'confirm';
//   action: Action;
// }>;

export type CopyMode = Readonly<{
  type: 'copy';
  source: ReadonlyArray<Item>;
}>;

export type RenameMode = Readonly<{
  type: 'rename';
  source: ReadonlyArray<Item>;
}>;

// export type ErrorMode = Readonly<{
//   type: 'error';
//   message: string;
// }>;

export type Action = Readonly<{
  id: string;
  // title: string;
  // themeColor?: 'normal' | 'warning';
  keys: ReadonlyArray<ActionKey>;
}>;

export type Dialog = Readonly<{
  type: StatusType;
  title: string | IntlMessage;
  lines?: ReadonlyArray<string | IntlMessage>;
  keys: ReadonlyArray<ActionKey>;
}>;

export type DialogButton = Readonly<{
  title: IntlMessage;
  onClick: () => Promise<Partial<State>>;
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

export const statusState = (
  message: IntlMessage,
  type: StatusType = 'info',
): Partial<State> => ({
  status: {
    message,
    type,
  },
});

export const useStore = create<State>(set => ({
  status: {
    message: { id: 'none' },
    type: 'none',
  },
  searchWord: '',
  selectedView: {
    name: 'search-box',
    updatedAt: 0,
  },
  checked: {},
  modifierKeys: toModifierKeys(),
  colorTheme: 'Dark',
  locale: 'en-US',
  setState: state => set(state),
  setStatus: status => set(() => ({ status })),
  setSearchWord: searchWord => set(() => ({ searchWord })),
  setItemList: itemList => set(() => ({ itemList })),
  setSelectedView: selectedView => set(() => ({ selectedView })),
  setChecked: checked => set(() => ({ checked })),
  setMode: mode => set(() => ({ mode })),
  setModifierKeys: modifierKeys =>
    set(() => ({ modifierKeys: toModifierKeys(modifierKeys) })),
  setSeparator: separator => set(() => ({ separator })),
  setDialog: dialog => set(() => ({ dialog })),
  setColorTheme: colorTheme => set(() => ({ colorTheme })),
  setLocale: locale => set(() => ({ locale })),
}));
