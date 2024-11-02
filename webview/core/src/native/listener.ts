import { MessageKey, Request, SetColorThemeRequest } from '@common/messages';
import { ColorTheme } from '@common/theme-color';
import React from 'react';

export const useNativeListener = ({
  setColorTheme,
}: Readonly<{
  setColorTheme: (colorTheme: ColorTheme) => void;
}>): void => {
  React.useEffect(() => {
    const callback = ({ data }: MessageEvent<Request<MessageKey>>) => {
      switch (data.key) {
        case 'set-color-theme': {
          const req = data as SetColorThemeRequest;
          setColorTheme(req.colorTheme);
          break;
        }
        default: {
          // console.error(`Invalid request: ${data.key}`);
          break;
        }
      }
    };
    window.addEventListener('message', callback);
    return () => {
      window.removeEventListener('message', callback);
    };
  }, [setColorTheme]);
};
