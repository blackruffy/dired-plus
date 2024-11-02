import { IntlIdBase } from '@core/i18n';
import { Status } from '@core/store';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const statusDuration = 5000;

export const StatusBar = <IntlId extends IntlIdBase>({
  status,
  setStatus,
}: Readonly<{
  status?: Status<IntlId>;
  setStatus: (status?: Status<IntlId>) => void;
}>): React.ReactElement => {
  const [updatedTime, setUpdatedTime] = React.useState(0);
  const [check, setCheck] = React.useState(false);
  const theme = useTheme();

  const colorStyle = React.useMemo(() => {
    switch (status?.type) {
      case undefined:
      case null:
      case 'none':
        return {};
      case 'error':
      case 'warning':
        return {
          color: theme.palette.getContrastText(theme.palette.warning.light),
          backgroundColor: theme.palette.warning.light,
        };
      default:
        return {
          color: theme.palette.getContrastText(theme.palette.info.dark),
          backgroundColor: theme.palette.info.dark,
        };
    }
  }, [status, theme]);

  React.useEffect(() => {
    if (status != null && status.type !== 'none') {
      setUpdatedTime(Date.now());
      setTimeout(() => {
        setCheck(!check);
      }, statusDuration);
    }
  }, [status, setUpdatedTime, check, setCheck]);

  React.useEffect(() => {
    if (Date.now() - updatedTime > statusDuration) {
      setStatus(undefined);
    }
  }, [check, updatedTime, setStatus]);

  return (
    <Box sx={[{ pl: 1, pr: 1, minHeight: `1.0em` }, colorStyle]}>
      <Typography sx={{ fontSize: `0.8em` }}>
        {status?.message == null ? null : (
          <FormattedMessage {...status.message} />
        )}
      </Typography>
    </Box>
  );
};
