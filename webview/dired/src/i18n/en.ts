import { Messages } from './ja';

export const en: Messages = {
  none: '',

  // command
  quit: 'Quit',
  toParentDir: 'Go Up',
  toSearchBox: 'To Search Box',
  cancel: 'Cancel',
  open: 'Open',
  copy: 'Copy',
  rename: 'Rename',
  delete: 'Delete',
  select: 'Select',
  reload: 'Reload',
  overwrite: 'Overwrite',
  completion: 'Completion',
  dismiss: 'Dismiss',
  createFile: 'Create File',
  createDir: 'Create Directory',
  addFolder: 'Add to Workspace',
  nextPage: 'Scroll Down',
  prevPage: 'Scroll Up',

  // status
  canceled: 'Canceled.',
  renamed: 'Renamed {src} to {dst}.',
  copied: 'Copied {src} to {dst}.',
  createdFile: 'Created file {src}.',
  createdDir: 'Created directory {src}.',
  deleted: 'Deleted {src}.',

  // search hint
  copyHint: 'Copy {src} to',
  renameHint: 'Rename {src} to',

  // dialog
  confirmOverwrite: '{dst} already exists. Do you want to overwrite it?',
  confirmDelete: 'Do you want to delete these files?',
  systemError: 'A system error has occurred.',
} as const;
