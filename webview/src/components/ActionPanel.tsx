import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';

const rows = [
  { key: 'a', desc: 'hoge' },
  { key: 'b', desc: 'hoge' },
  { key: 'c', desc: 'hoge' },
  { key: 'd', desc: 'hoge' },
];

export const ActionPanel = (): React.ReactElement => (
  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
    <TableHead>
      <TableRow>
        <TableCell>Key</TableCell>
        <TableCell align='right'>Description</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map(row => (
        <TableRow
          key={row.key}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component='th' scope='row'>
            {row.key}
          </TableCell>
          <TableCell align='right'>{row.desc}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
