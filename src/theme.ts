import { setColorTheme } from '@src/filer/request';
import * as vscode from 'vscode';
import { ColorTheme } from './common/theme-color';

const getColorThemeString = (colorTheme: vscode.ColorTheme): ColorTheme => {
  switch (colorTheme.kind) {
    case vscode.ColorThemeKind.Dark:
      return 'Dark';
    case vscode.ColorThemeKind.Light:
      return 'Light';
    case vscode.ColorThemeKind.HighContrast:
      return 'HighContrast';
    case vscode.ColorThemeKind.HighContrastLight:
      return 'HighContrastLight';
  }
};

export const getColorTheme = (): ColorTheme =>
  getColorThemeString(vscode.window.activeColorTheme);

export const initializeTheme = (panel: vscode.WebviewPanel): void => {
  vscode.window.onDidChangeActiveColorTheme(colorTheme => {
    setColorTheme(panel, getColorThemeString(colorTheme));
  });
};
