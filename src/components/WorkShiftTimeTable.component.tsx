import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import ResetIcon from '@mui/icons-material/Undo';

import { IOperator } from '../interfaces/work.interface';
import workSlice from '../store/reducers/work/work.slice';
import { formatTime } from '../utils';

const MyRow = (props: { row: IOperator; childIds: number[] }) => {
  const { id, parentIds, times } = props.row;
  const isChild = props.childIds.includes(id);

  const dispatch = useDispatch();
  const [isOpen, setOpen] = React.useState(false);

  const handleResetTimes = React.useCallback(
    (id: number) => () => {
      dispatch(workSlice.actions.handleResetTimesById({ id }));
    },
    [dispatch],
  );

  return (
    <>
      <TableRow
        key={id}
        sx={(theme) => ({
          '&:last-child td, &:last-child th': { border: 0 },
          ...(isChild && { backgroundColor: theme.palette.action.hover }),
        })}
        hover
        onClick={() => setOpen(!isOpen)}
      >
        {/* <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell> */}
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
            <IconButton
              aria-label="undo add value"
              size="small"
              onClick={handleResetTimes(id)}
              color="secondary"
              disabled={times.length === 0}
            >
              <ResetIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Значение</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {times.map((time, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {formatTime(time)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

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
      <Table size="small">
        <TableHead>
          <TableRow>
            {/* <TableCell></TableCell> */}
            <TableCell>Оператор №</TableCell>
            <TableCell>N</TableCell>
            <TableCell align="right">AVG</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <MyRow key={row.id} row={row} childIds={childIds} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WorkShiftTimeTable;
