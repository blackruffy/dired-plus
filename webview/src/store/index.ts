import { ItemList } from '@common/messages';
import { create } from 'zustand';

export type State = Readonly<{
  itemList?: ItemList;
  selectedIndex: number;
  checked: Readonly<{ [key: number]: boolean }>;
  setItemList: (itemList: ItemList) => void;
  setSelectedIndex: (selectedIndex: number) => void;
  setChecked: (checked: Readonly<{ [key: number]: boolean }>) => void;
}>;

// stateの定義と更新ロジックを含むストアを作成。
export const useStore = create<State>(set => ({
  selectedIndex: 0,
  checked: {},
  setItemList: itemList => set(() => ({ itemList })),
  setSelectedIndex: selectedIndex => set(() => ({ selectedIndex })),
  setChecked: checked => set(() => ({ checked })),
}));
