import { core } from '@core/index';

export type MessageId = keyof typeof ja;

export type Messages = core.i18n.IntlMessages<MessageId>;

export type MessageIdMap = core.i18n.IntlMessageIdMap<MessageId>;

export const ja = {
  none: '',

  // command
  quit: '終了',
  cancel: 'キャンセル',
  open: '開く',
  dismiss: '閉じる',
  nextPage: '次のページ',
  prevPage: '前のページ',
} as const;

export const messageId: MessageIdMap = core.i18n.getIntlMessageIdMap(ja);
