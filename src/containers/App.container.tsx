import React from 'react';
import * as ReactU from 'react-use';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from '@mui/material/Divider';

import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

import { MyPaper } from '../styled/MyPaper.styled';

import Stopwatch from '../components/Stopwatch.component';
import WorkShiftTimeTable from '../components/WorkShiftTimeTable.component';

import workSlice from '../store/reducers/work/work.slice';

const AppContainer = (props: { handleBack? }) => {
  const { handleBack: handleBackToSetting } = props;

  const dispatch = useDispatch();
  const workState = useSelector((state) => state.work);
  const { totalOperatorsCount, workShiftCount, workShiftStep, workShifts } = workState;
  const { operatorsCount } = workShifts[workShiftStep] || {};

  const workShiftSteps = React.useMemo(
    () => Array.from(Array(workShiftCount)).map((_, e) => `Cмена ${e + 1}`),
    [workShiftCount],
  );

  const onSaveTimer = React.useCallback(
    (id: number, timer: number) => {
      dispatch(workSlice.actions.onSaveTimer({ id, timer }));
    },
    [dispatch],
  );

  const handleNextWorkShift = React.useCallback(() => {
    dispatch(workSlice.actions.nextStep());
  }, [dispatch]);

  const handlePrevWorkShift = React.useCallback(() => {
    dispatch(workSlice.actions.prevStep());
  }, [dispatch]);

  const handleResetTimes = React.useCallback(() => {
    dispatch(workSlice.actions.handleResetTimes());
  }, [dispatch]);

  // const handleInitOperators = React.useCallback(
  //   (operators: any[]) => {
  //     dispatch(workSlice.actions.initOperators({ operators }));
  //   },
  //   [dispatch],
  // );

  const [onStartAll, handleStartPauseAll] = ReactU.useToggle(false);
  const [onStopAll, handleStopAll] = ReactU.useToggle(false);

  React.useEffect(() => {
    dispatch(workSlice.actions.updateWorkShifts());
  }, [dispatch, workShiftCount]);

  React.useEffect(() => {
    dispatch(workSlice.actions.updateWorkShiftOperators());
  }, [dispatch, operatorsCount]);

  React.useEffect(() => {
    // only for first step
    dispatch(workSlice.actions.setOperatorsCount({ count: totalOperatorsCount, step: 0 }));
  }, [dispatch, totalOperatorsCount]);

  const tableRows = workShifts[workShiftStep]?.operators.map((e) => ({ id: e.id, times: [...e.times] })) || [];
  tableRows.sort((a, b) => a.id - b.id);

  return (
    <Container component="main" maxWidth="lg">
      <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          <MyPaper>
            <Button onClick={handleBackToSetting}>Назад к настройкам</Button>
          </MyPaper>

          {/* WorkShift Stepper */}
          <MyPaper>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              <b>Рабочая смена</b>
            </Typography>
            <Stepper activeStep={workShiftStep} sx={{ pt: 3, pb: 5 }} alternativeLabel>
              {workShiftSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {workShiftStep > 0 && <Button onClick={handlePrevWorkShift}>Назад</Button>}
              {workShiftStep < workShiftCount - 1 ? (
                <Button variant="contained" onClick={handleNextWorkShift}>
                  Дальше
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => {
                    alert('Wohooh!');
                  }}
                >
                  Finish
                </Button>
              )}
            </Box>
          </MyPaper>
        </Grid>
      </Grid>

      <Divider />
      <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          <MyPaper>
            <Typography component="h6">Отмечайте начало и конец выполнения работы оператора</Typography>
          </MyPaper>
          <MyPaper>
            {/* TODO: split to ext comp */}
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

            <Grid container justifyContent="center" spacing={{ xs: 1, md: 3 }} columns={3}>
              {Array.from(Array(totalOperatorsCount)).map((_, index) => (
                <Stopwatch
                  key={index}
                  id={index + 1}
                  onSave={onSaveTimer}
                  simple
                  savable
                  onGlobalHandlers={{ onStartAll, onStopAll }}
                />
              ))}
            </Grid>
          </MyPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <MyPaper>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              <b>Таблица</b>
            </Typography>
            <Typography component="p">
              Среднее время работы операторов <b>{workShiftStep + 1}</b> смены
            </Typography>
            <WorkShiftTimeTable rows={tableRows} />

            <Divider />
            <Button onClick={handleResetTimes} sx={{ mt: 1 }} fullWidth>
              Сбросить прогресс смены
            </Button>
          </MyPaper>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <MyPaper>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              <b>График</b>
            </Typography>
            <Typography component="p">скоро здесь будет %%график%%</Typography>
          </MyPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppContainer;
