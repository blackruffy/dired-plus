import { Box, Theme, useTheme } from '@mui/material';
import { Action, useStore } from '@src/store';
import React from 'react';

// export const isCreateFileOrDirectoryMode = (
//   selectedView: SelectedView,
//   itemList: ItemList | undefined,
// ): boolean =>
//   selectedView.name === 'search-box' && itemList?.items.length === 0;

// const isListItem = (selectedView: SelectedView): selectedView is ListItem =>
//   selectedView.name === 'list-item';

// export const isFileActionMode = (
//   selectedView: SelectedView,
//   itemList: ItemList | undefined,
// ): boolean =>
//   isListItem(selectedView) &&
//   itemList?.items[selectedView.index].itemType === 'file';

// export const isDirectoryActionMode = (
//   selectedView: SelectedView,
//   itemList: ItemList | undefined,
// ): boolean =>
//   selectedView.name === 'list-item' &&
//   itemList?.items[selectedView.index].itemType === 'directory';

const getStyles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  header: {
    padding: `4px 16px 4px 16px`,
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: '0.8rem',
  },
  listContainer: {
    display: 'grid',
    gridTemplateColumns: `auto 1fr auto 1fr`,
    fontSize: '0.7rem',
  },
  row: {
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  key: {
    width: `150px`,
    margin: 0,
    padding: `4px 16px 4px 16px`,
  },
  desc: {
    flex: 1,
    padding: `4px 16px 4px 16px`,
  },
});

export const ActionPanel = ({
  action,
}: Readonly<{ action?: Action }>): React.ReactElement => {
  const { selectedView, itemList } = useStore();
  const theme = useTheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);

  // const data = React.useMemo<ActionData | null>(() => {
  //   if (confirm?.command === 'delete-file') {
  //     return {
  //       title: 'Are you sure to delete the file?',
  //       titleFontColor: theme.palette.warning.contrastText,
  //       titleBackgroundColor: theme.palette.warning.light,
  //       keys: [
  //         { key: 'y', desc: 'Delete the file' },
  //         { key: 'n', desc: 'Cancel' },
  //       ],
  //     };
  //   } else if (confirm?.command === 'delete-directory') {
  //     return {
  //       title: 'Are you sure to delete the directory?',
  //       titleFontColor: theme.palette.warning.contrastText,
  //       titleBackgroundColor: theme.palette.warning.light,
  //       keys: [
  //         { key: 'y', desc: 'Delete the directory' },
  //         { key: 'n', desc: 'Cancel' },
  //       ],
  //     };
  //   } else if (isCreateFileOrDirectoryMode(selectedView, itemList)) {
  //     return {
  //       title: 'Shortcut keys',
  //       keys: [
  //         { key: 'Enter', desc: 'Create a new file' },
  //         { key: 'Shift + Enter', desc: 'Create a new directory' },
  //       ],
  //     };
  //   } else if (isFileActionMode(selectedView, itemList)) {
  //     return {
  //       title: 'Shortcut keys',
  //       keys: [
  //         { key: 'Enter', desc: 'Open the file' },
  //         { key: 'Space', desc: 'Select the file' },
  //         { key: 'c', desc: 'Copy the file' },
  //         { key: 'r', desc: 'Rename the file' },
  //         { key: 'd', desc: 'Delete the file' },
  //       ],
  //     };
  //   } else if (isDirectoryActionMode(selectedView, itemList)) {
  //     return {
  //       title: 'Shortcut keys',
  //       keys: [
  //         { key: 'Enter', desc: 'Open the directory' },
  //         { key: 'Space', desc: 'Select the directory' },
  //         { key: 'c', desc: 'Copy the directory' },
  //         { key: 'r', desc: 'Rename the directory' },
  //         { key: 'd', desc: 'Delete the directory' },
  //       ],
  //     };
  //   } else {
  //     return null;
  //   }
  // }, [selectedView, itemList, theme, confirm]);

  const colorStyle = React.useMemo(
    () =>
      action?.themeColor === 'normal'
        ? {}
        : {
            color: theme.palette.warning.contrastText,
            backgroundColor: theme.palette.warning.light,
          },
    [action, theme],
  );

  if (action === undefined) {
    return <></>;
  } else {
    return (
      <Box sx={styles.container}>
        <Box
          sx={[
            styles.header,
            {
              ...colorStyle,
              fontWeight: `bold`,
            },
          ]}
        >
          {action.title}
        </Box>
        <Box sx={styles.listContainer}>
          {action.keys.flatMap(({ name, desc }, i) => [
            <Box
              sx={{
                gridRow: `${Math.floor(i / 2) + 1}`,
                gridColumn: i % 2 === 0 ? `1` : `3`,
                padding: `4px 16px 4px 16px`,
                display: `flex`,
                justifyContent: `flex-start`,
                alignItems: `center`,
              }}
            >
              {name}
            </Box>,
            <Box
              sx={{
                gridRow: `${Math.floor(i / 2) + 1}`,
                gridColumn: i % 2 === 0 ? `2` : `4`,
                padding: `4px 4px 4px 4px`,
                borderRight:
                  i % 2 === 0 ? `1px solid ${theme.palette.divider}` : `none`,
                display: `flex`,
                justifyContent: `flex-start`,
                alignItems: `center`,
              }}
            >
              {desc}
            </Box>,
          ])}
        </Box>
      </Box>
    );
  }
};
