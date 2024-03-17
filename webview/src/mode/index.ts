import { useStore } from '@src/store';

export type Mode =
  | UpdatePathMode
  | CreateMode
  | SelectMode
  | CopyMode
  | RenameMode
  | DeleteMode
  | ConfirmMode;

export type UpdatePathMode = Readonly<{
  type: 'update-path';
  panel: ModePanel;
}>;

export type CreateMode = Readonly<{
  type: 'create';
  itemType: 'file' | 'directory';
  path: string;
  panel: ModePanel;
}>;

export type SelectMode = Readonly<{
  type: 'select';
  panel: ModePanel;
}>;

export type CopyMode = Readonly<{
  type: 'copy';
  itemType: 'file' | 'directory';
  sourcePaths: ReadonlyArray<string>;
  panel: ModePanel;
}>;

export type RenameMode = Readonly<{
  type: 'rename';
  itemType: 'file' | 'directory';
  sourcePaths: ReadonlyArray<string>;
  panel: ModePanel;
}>;

export type DeleteMode = Readonly<{
  type: 'delete';
  itemType: 'file' | 'directory';
  paths: ReadonlyArray<string>;
  panel: ModePanel;
}>;

export type ConfirmMode = Readonly<{
  type: 'confirm';
}>;

export type ModePanel = Readonly<{
  title: string;
  theme: 'normal' | 'warning';
  keys: ReadonlyArray<{ key: string; desc: string }>;
}>;

// export const useMode = () => {
//   const store = useStore();

//   if (
//     store.selectedView.name === 'search-box' &&
//     store.itemList?.items.length === 0
//   )
// };
