import { Box } from '@mui/material';
import React from 'react';

export const CatchError = ({
  children,
}: React.PropsWithChildren): React.ReactElement => {
  try {
    return <>{children}</>;
  } catch (error) {
    return <Box>{String(error)}</Box>;
  }
};
