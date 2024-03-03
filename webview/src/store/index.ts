import { ItemList } from '@common/messages';
import { create } from 'zustand';

export type State = Readonly<{
  searchWord: string;
  itemList?: ItemList;
  selectedView: SelectedView;
  checked: Readonly<{ [key: number]: boolean }>;
  setSearchWord: (searchWord: string) => void;
  setItemList: (itemList: ItemList) => void;
  setSelectedView: (selectedView: SelectedView) => void;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
}>;

export type SelectedView = SearchBox | ListItem;

type SearchBox = Readonly<{ name: 'search-box'; updatedAt: number }>;
type ListItem = Readonly<{
  name: 'list-item';
  index: number;
  updatedAt: number;
}>;

export const useStore = create<State>(set => ({
  searchWord: '',
  selectedView: { name: 'search-box', updatedAt: 0 },
  checked: {},
  setSearchWord: searchWord => set(() => ({ searchWord })),
  setItemList: itemList => set(() => ({ itemList })),
  setSelectedView: selectedView => set(() => ({ selectedView })),
  setChecked: checked => set(() => ({ checked })),
}));
