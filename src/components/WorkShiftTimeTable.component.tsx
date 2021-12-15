import React from 'react';
import { useSelector } from 'react-redux';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { formatTime } from '../utils';

const WorkShiftTimeTable = () => {
  const workState = useSelector((state) => state.work);
  const { workShifts, workShiftStep } = workState;

  const [childIds, rows] = React.useMemo(() => {
    const operators = workShifts[workShiftStep]?.operators || [];

    const childIds = Object.keys(
      operators
        .map((e) => e.parentIds)
        .flat()
        .reduce((prev, cur) => ({ ...prev, [cur]: 1 }), {}),
    ).map(Number);

    const rows = [...operators] /* .map((e) => ({ id: e.id, times: [...e.times] })) */ || [];
    rows.sort((a, b) => a.id - b.id);

    return [childIds, rows];
  }, [workShifts, workShiftStep]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Оператор №</TableCell>
            <TableCell>N</TableCell>
            <TableCell align="right">AVG</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const isChild = childIds.includes(row.id);
            return (
              <TableRow
                key={row.id}
                sx={(theme) => ({
                  '&:last-child td, &:last-child th': { border: 0 },
                  ...(isChild && { backgroundColor: theme.palette.action.hover }),
                })}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                  {row.parentIds.length > 0 && ` (${row.parentIds.join(', ')})`}
                </TableCell>
                <TableCell>{isChild ? '-' : row.times.length}</TableCell>
                <TableCell align="right">
                  {row.times.length === 0 || isChild
                    ? '-'
                    : formatTime(Math.floor(row.times.reduce((a, b) => a + b, 0) / row.times.length))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WorkShiftTimeTable;
