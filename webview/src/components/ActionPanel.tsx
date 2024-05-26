import { Box, Theme, useTheme } from '@mui/material';
import { Action } from '@src/store';
import React from 'react';

const getStyles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  header: {
    padding: `0px 8px 0px 8px`,
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
    padding: `2px 8px 2px 8px`,
  },
  desc: {
    flex: 1,
    padding: `2px 8px 2px 8px`,
  },
});

export const ActionPanel = ({
  action,
}: Readonly<{ action?: Action }>): React.ReactElement => {
  const theme = useTheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);

  const colorStyle = React.useMemo(
    () =>
      action?.themeColor === 'warning'
        ? {
            color: theme.palette.getContrastText(theme.palette.warning.light),
            backgroundColor: theme.palette.warning.light,
          }
        : {
            color: theme.palette.getContrastText(theme.palette.info.dark),
            backgroundColor: theme.palette.info.dark,
          },
    [action, theme],
  );

  if (action === undefined) {
    return <></>;
  } else {
    return (
      <Box
        sx={[
          styles.container,
          {
            border: `1px solid ${colorStyle.backgroundColor}`,
          },
        ]}
      >
        <Box sx={[styles.header, colorStyle]}>{action.title}</Box>
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
