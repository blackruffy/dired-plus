export type Item<Self> = Readonly<{
  getSearchWord: (self: Self) => string;
}>;

export type ItemList<Self, Item> = Readonly<{
  getItems: (self: Self) => ReadonlyArray<Item>;
}>;
