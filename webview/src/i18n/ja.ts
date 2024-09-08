export type Messages = Readonly<{
  [K in keyof typeof ja]: string;
}>;

export type MessageId = keyof Messages;

export type MessageIdMap = Readonly<{
  [K in MessageId]: K;
}>;

export const ja = {
  none: '',

  // command
  quit: '終了',
  toParentDir: '親ディレクトリへ',
  toSearchBox: '検索ボックスへ',
  cancel: 'キャンセル',
  open: '開く',
  copy: 'コピー',
  rename: '移動',
  delete: '削除',
  select: '選択',
  reload: '更新',
  overwrite: '上書き',
  completion: '補完',
  dismiss: '閉じる',
  createFile: '新規ファイル',
  createDir: '新規ディレクトリ',
  addFolder: 'ワークスペースに追加',

  // status
  canceled: 'キャンセルしました。',
  renamed: '{src}を{dst}に移動しました。',
  copied: '{src}を{dst}にコピーしました。',
  createdFile: '{src}を作成しました。',
  createdDir: '{src}を作成しました。',
  deleted: '{src}を削除しました。',

  // search hint
  copyHint: '{src}のコピー先',
  renameHint: '{src}の移動先',

  // dialog
  confirmOverwrite: '{dst}はすでに存在します。上書きしますか？',
  confirmDelete: 'これらのファイルを削除しますか？',
  systemError: 'システムエラーが発生しました。',
} as const;

export const messageId: MessageIdMap = Object.keys(ja).reduce(
  (acc, key) => ({
    ...acc,
    [key]: key,
  }),
  {} as MessageIdMap,
);
