import React from 'react';
import * as ReactU from 'react-use';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

import Stopwatch from './Stopwatch.component';

import workSlice from '../store/reducers/work/work.slice';

const OperatorsStopwatch = () => {
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

  const onSaveTimer = React.useCallback(
    (id: number, timer: number) => {
      dispatch(workSlice.actions.onSaveTimer({ id, timer }));
    },
    [dispatch],
  );

  const [onStartAll, handleStartPauseAll] = ReactU.useToggle(false);
  const [onStopAll, handleStopAll] = ReactU.useToggle(false);

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        <b>Секундомер</b>
      </Typography>

      <ButtonGroup disableElevation sx={{ mb: 1 }} fullWidth orientation="vertical">
        <Button onClick={handleStartPauseAll} color="secondary" endIcon={<PlayIcon />}>
          Запустить/Приостановить все
        </Button>
        <Button onClick={handleStopAll} color="error" endIcon={<StopIcon />}>
          Остановить/Сбросить все
        </Button>
      </ButtonGroup>

      <Grid container justifyContent="center" spacing={{ xs: 1, md: 3 }} columns={{ xs: 4, sm: 8, md: 10 }}>
        {rows
          .filter((e) => !childIds.includes(e.id))
          .map((e) => (
            <Grid key={e.id} item xs={2} sm={2} md={2}>
              <Stopwatch id={e.id} onSave={onSaveTimer} simple savable onGlobalHandlers={{ onStartAll, onStopAll }} />
            </Grid>
          ))}
      </Grid>

      <Grid container justifyContent="center" sx={{ mt: 3 }} columns={3}>
        <Stopwatch />
      </Grid>
    </>
  );
};
export default OperatorsStopwatch;
