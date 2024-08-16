import { MessageKey, Request, SetColorThemeRequest } from '@common/messages';
import { useStore } from '@src/store';
import React from 'react';

export const useNativeListener = (): void => {
  const { setColorTheme } = useStore();

  React.useEffect(() => {
    const callback = ({ data }: MessageEvent<Request<MessageKey>>) => {
      switch (data.key) {
        case 'set-color-theme': {
          const req = data as SetColorThemeRequest;
          setColorTheme(req.colorTheme);
          break;
        }
        default: {
          console.error(`Invalid request: ${data.key}`);
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
