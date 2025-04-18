import {
  SetColorThemeRequest,
  SetColorThemeResponse,
  UpdateItemListRequest,
  UpdateItemListResponse,
} from '@src/common/messages';
import { ColorTheme } from '@src/common/theme-color';
import { request } from '@src/helpers/request';
import { State } from '@src/state';
import * as nodePath from 'path';
import * as vscode from 'vscode';
import { getSeparator } from './helpers';

export const updateItemList = async (
  state: State,
  panel: vscode.WebviewPanel,
): Promise<void> => {
  const path =
    state.lastActivePath == null
      ? undefined
      : `${nodePath.dirname(state.lastActivePath)}${getSeparator()}`;

  await request<UpdateItemListRequest, UpdateItemListResponse>(panel, {
    key: 'update-item-list',
    path,
  });
};

export const setColorTheme = async (
  panel: vscode.WebviewPanel,
  colorTheme: ColorTheme,
): Promise<void> => {
  await request<SetColorThemeRequest, SetColorThemeResponse>(panel, {
    key: 'set-color-theme',
    colorTheme,
  });
};
