import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ResetIcon from '@mui/icons-material/Undo';

import workSlice from '../store/reducers/work/work.slice';
import { formatTime } from '../utils';

const WorkShiftTimeTable = () => {
  const dispatch = useDispatch();
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

  const handleResetTimes = React.useCallback(
    (id: number) => () => {
      dispatch(workSlice.actions.handleResetTimesById({id}));
    },
    [dispatch],
  );

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Оператор №</TableCell>
            <TableCell>N</TableCell>
            <TableCell align="right">AVG</TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const { id, parentIds, times } = row;
            const isChild = childIds.includes(id);
            return (
              <TableRow
                key={id}
                sx={(theme) => ({
                  '&:last-child td, &:last-child th': { border: 0 },
                  ...(isChild && { backgroundColor: theme.palette.action.hover }),
                })}
              >
                <TableCell component="th" scope="row">
                  {id}
                  {parentIds.length > 0 && ` (${parentIds.join(', ')})`}
                </TableCell>
                <TableCell>{isChild ? '-' : times.length}</TableCell>
                <TableCell align="right">
                  {times.length === 0 || isChild
                    ? '-'
                    : formatTime(Math.floor(times.reduce((a, b) => a + b, 0) / times.length))}
                </TableCell>
                <TableCell align="right">
                  {!isChild && (
                    <Button onClick={handleResetTimes(id)} color="secondary" disabled={times.length === 0}>
                      <ResetIcon />
                    </Button>
                  )}
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
