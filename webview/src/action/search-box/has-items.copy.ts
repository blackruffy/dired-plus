import { Action, Mode } from '@src/store';

export const searchBoxHasItemsCopy = (
  setMode: (mode?: Mode) => void,
): Action => ({
  title: 'Available actions',
  keys: [
    {
      name: 'Enter',
      desc: '',
      keyEvent: {
        code: 'Enter',
        run: () =>
          setMode({
            type: 'confirm',
            action: {
              title: 'The file already exists. Do you want to overwrite it?',
              keys: [
                {
                  name: 'y',
                  desc: 'Overwrite the file',
                  keyEvent: {
                    code: 'KeyY',
                    run: () => {
                      // copy file or directory
                      // source: mode?.source;
                      // destination: itemList?.path;
                    },
                  },
                },
                {
                  name: 'n',
                  desc: 'Cancel',
                  keyEvent: {
                    code: 'KeyN',
                    run: () => setMode(),
                  },
                },
              ],
            },
          }),
      },
    },
  ],
});
