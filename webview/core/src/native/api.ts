import {
  ClosePanelRequest,
  ClosePanelResponse,
  GetColorThemeRequest,
  GetColorThemeResponse,
  GetLocaleRequest,
  GetLocaleResponse,
  GetSeparatorRequest,
  GetSeparatorResponse,
  OpenFileRequest,
  OpenFileResponse,
} from '@common/messages';
import { ColorTheme } from '@common/theme-color';
import { request } from './request';

export const getColorTheme = async (): Promise<ColorTheme> =>
  (
    await request<GetColorThemeRequest, GetColorThemeResponse>({
      key: 'get-color-theme',
    })
  ).colorTheme;

export const getLocale = async (): Promise<string> =>
  (
    await request<GetLocaleRequest, GetLocaleResponse>({
      key: 'get-locale',
    })
  ).locale;

export const getSeparator = async (): Promise<string> =>
  (
    await request<GetSeparatorRequest, GetSeparatorResponse>({
      key: 'get-separator',
    })
  ).separator;

export const closePanel = async (): Promise<void> => {
  await request<ClosePanelRequest, ClosePanelResponse>({
    key: 'close-panel',
  });
};

export const openFile = async (path: string): Promise<void> => {
  await request<OpenFileRequest, OpenFileResponse>({
    key: 'open-file',
    path,
  });
};
