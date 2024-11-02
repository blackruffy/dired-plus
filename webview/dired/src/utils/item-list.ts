import { DiredItem, DiredItemList } from '@common/dired-item';
import { typeclass } from '@core/utils';

export const itemInstance: typeclass.Item<DiredItem> = {
  getSearchWord: self => self.path,
};

export const itemListInstance: typeclass.ItemList<DiredItemList, DiredItem> = {
  getItems: self => self.items,
};
