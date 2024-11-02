import { IntlIdBase } from '@core/i18n';
import * as store from '@core/store';
import ErrorIcon from '@mui/icons-material/Error';
import * as MUI from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const Dialog = <State, IntlId extends IntlIdBase>({
  dialog,
}: Readonly<{
  dialog?: store.Dialog<State, IntlId>;
}>): React.ReactElement => {
  const theme = MUI.useTheme();

  return (
    <MUI.Backdrop
      open={dialog != null}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        p: 2,
      }}
    >
      <MUI.Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MUI.Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ErrorIcon
            sx={{
              m: 1,
              color:
                dialog?.type === 'error'
                  ? theme.palette.error.light
                  : theme.palette.info.light,
            }}
          />
          <MUI.Typography sx={{ fontWeight: 'bold' }}>
            {dialog?.title == null ? null : typeof dialog.title === 'string' ? (
              dialog.title
            ) : (
              <FormattedMessage {...dialog.title} />
            )}
          </MUI.Typography>
        </MUI.Box>
        <MUI.Box
          sx={{
            maxHeight: '15rem',
            overflow: 'scroll',
          }}
        >
          {dialog?.lines?.map?.((line, index) => (
            <MUI.Typography key={index}>
              {typeof line === 'string' ? line : <FormattedMessage {...line} />}
            </MUI.Typography>
          ))}
        </MUI.Box>
      </MUI.Box>
    </MUI.Backdrop>
  );
};
