import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

export const SearchHint = ({
  message,
}: Readonly<{ message?: React.ReactElement }>): React.ReactElement => {
  const theme = useTheme();

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
