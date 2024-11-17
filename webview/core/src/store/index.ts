import { ColorTheme } from '@common/theme-color';
import { ActionKey, ModifierKeys } from '@core/action';
import { IntlIdBase, IntlMessage } from '@core/i18n';
import { toModifierKeys } from '@core/keyboard/keys';

export type State<Self, IntlId extends IntlIdBase, ItemList> = Readonly<{
  status?: Status<IntlId>;
  itemList?: ItemList;
  searchWord: string;
  searchBox: SearchBox;
  selectedItemIndex?: number;
  modifierKeys: ModifierKeys;
  separator?: string;
  dialog?: Dialog<Self, IntlId>;
  colorTheme: ColorTheme;
  locale: string;
  setState: (state: Partial<Self>) => void;
  setItemList: (itemList: ItemList) => void;
  setStatus: (status?: Status<IntlId>) => void;
  setSearchWord: (searchWord: string) => void;
  setSearchBox: (searchBox: SearchBox) => void;
  setSelectedItemIndex: (selectedItemIndex?: number) => void;
  setModifierKeys: (modifierKeys: Partial<ModifierKeys>) => void;
  setSeparator: (separator: string) => void;
  setDialog: (dialog?: Dialog<Self, IntlId>) => void;
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

export type Status<IntlId extends IntlIdBase> = Readonly<{
  message: IntlMessage<IntlId>;
  type: StatusType;
}>;

export type SearchBox = Readonly<{
  selectionStart?: number;
  selectionEnd?: number;
}>;

export type Dialog<State, IntlId extends IntlIdBase> = Readonly<{
  type: StatusType;
  title: string | IntlMessage<IntlId>;
  lines?: ReadonlyArray<string | IntlMessage<IntlId>>;
  keys: ReadonlyArray<ActionKey<State, IntlId>>;
}>;

export type DialogButton<State, IntlId extends IntlIdBase> = Readonly<{
  title: IntlMessage<IntlId>;
  onClick: () => Promise<Partial<State>>;
}>;

export const createStore = <S, IntlId extends IntlIdBase, ItemList>(
  set: (f: Partial<S> | (() => Partial<S>)) => void,
  convert: (s: Partial<State<S, IntlId, ItemList>>) => Partial<S>,
): State<S, IntlId, ItemList> => ({
  status: {
    message: { id: 'none' as IntlId },
    type: 'none',
  },
  searchWord: '',
  searchBox: {},
  selectedItemIndex: undefined,
  modifierKeys: toModifierKeys(),
  colorTheme: 'Dark',
  locale: 'en-US',
  setState: state => set(state),
  setItemList: itemList => set(() => convert({ itemList })),
  setStatus: status => set(() => convert({ status })),
  setSearchWord: searchWord => set(() => convert({ searchWord })),
  setSearchBox: searchBox => set(() => convert({ searchBox })),
  setSelectedItemIndex: selectedItemIndex =>
    set(() => convert({ selectedItemIndex })),
  setModifierKeys: modifierKeys =>
    set(() => convert({ modifierKeys: toModifierKeys(modifierKeys) })),
  setSeparator: separator => set(() => convert({ separator })),
  setDialog: dialog => set(() => convert({ dialog })),
  setColorTheme: colorTheme => set(() => convert({ colorTheme })),
  setLocale: locale => set(() => convert({ locale })),
});
