import { Box, Typography, useTheme } from '@mui/material';
import { messageId } from '@src/i18n/ja';
import { Mode } from '@src/store';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const SearchHint = ({
  mode,
}: Readonly<{ mode?: Mode }>): React.ReactElement => {
  const theme = useTheme();

  const message = React.useMemo<React.ReactElement | undefined>(() => {
    switch (mode?.type) {
      case 'copy':
        return (
          <FormattedMessage
            id={messageId.copyHint}
            values={{ src: mode.source.map(_ => _.name).join(',') }}
          />
        );
      case 'rename':
        return (
          <FormattedMessage
            id={messageId.renameHint}
            values={{ src: mode.source.map(_ => _.name).join(',') }}
          />
        );
      default:
        return undefined;
    }
  }, [mode]);

  if (message == null) {
    return <></>;
  } else {
    return (
      <Box
        sx={{
          pl: 1,
          pr: 1,
          minHeight: `1.0em`,
          color: theme.palette.getContrastText(theme.palette.info.dark),
          backgroundColor: theme.palette.info.dark,
        }}
      >
        <Typography sx={{ fontSize: `0.8em` }}>{message}</Typography>
      </Box>
    );
  }
};
