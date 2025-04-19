import { core } from '@core/index';

export type MessageId = keyof typeof ja;

export type Messages = core.i18n.IntlMessages<MessageId>;

export type MessageIdMap = core.i18n.IntlMessageIdMap<MessageId>;

export const ja = {
  none: '',

  // command
  quit: '終了',
  toParentDir: '親ディレクトリへ',
  toSearchBox: '検索ボックスへ',
  cancel: 'キャンセル',
  open: '開く',
  copy: 'コピー',
  copyPath: 'パスをコピー',
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
  nextPage: '次を表示',
  prevPage: '前を表示',

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
  helpEnterToClose: 'Enter キーで閉じる',
} as const;

export const messageId: MessageIdMap = core.i18n.getIntlMessageIdMap(ja);
