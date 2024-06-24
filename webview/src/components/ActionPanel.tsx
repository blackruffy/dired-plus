import { Box, Divider, Theme, useTheme } from '@mui/material';
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
    //display: 'grid',
    //gridTemplateColumns: `auto 1fr auto 1fr`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
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
      <Box sx={[styles.container]}>
        <Box sx={[styles.header, colorStyle]}>{action.title}</Box>
        <Divider />
        <Box sx={styles.listContainer}>
          {action.keys.map(({ name, desc }, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: `4px`,
              }}
            >
              <Box
                sx={{
                  //gridRow: `${Math.floor(i / 2) + 1}`,
                  //gridColumn: i % 2 === 0 ? `1` : `3`,
                  backgroundColor: theme.palette.text.primary,
                  color: theme.palette.background.default,
                  fontWeight: `bold`,
                  borderRadius: `0.5em`,
                  padding: `2px 8px 2px 8px`,
                  display: `flex`,
                  justifyContent: `flex-start`,
                  alignItems: `center`,
                }}
              >
                {name}
              </Box>
              <Box
                sx={{
                  //gridRow: `${Math.floor(i / 2) + 1}`,
                  //gridColumn: i % 2 === 0 ? `2` : `4`,
                  padding: `4px 4px 4px 4px`,
                  display: `flex`,
                  justifyContent: `flex-start`,
                  alignItems: `center`,
                }}
              >
                {desc}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
};
