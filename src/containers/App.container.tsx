import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { MyPaper } from '../styled/MyPaper.styled';

import OperatorsStopwatch from '../components/OperatorsStopwatch.component';
import WorkShiftStepper from '../components/WorkShiftStepper.component';
import WorkShiftTimeTable from '../components/WorkShiftTimeTable.component';
import ChartTimes from '../components/ChartTimes.component';

import workSlice from '../store/reducers/work/work.slice';

const AppContainer = (props: { handleBack? }) => {
  const { handleBack: handleBackToSetting } = props;

  const dispatch = useDispatch();
  const workState = useSelector((state) => state.work);
  const { totalOperatorsCount, workShiftCount, workShiftStep, workShifts } = workState;
  const { operatorsCount } = workShifts[workShiftStep] || {};

  const handleResetTimes = React.useCallback(() => {
    dispatch(workSlice.actions.handleResetTimes());
  }, [dispatch]);

  const handleResetAll = React.useCallback(() => {
    dispatch(workSlice.actions.resetAll());
    dispatch(workSlice.actions.updateWorkShifts());
    dispatch(workSlice.actions.setOperatorsCount({ count: totalOperatorsCount, step: 0 }));
    dispatch(workSlice.actions.updateWorkShiftOperators());
  }, [dispatch, totalOperatorsCount]);

  React.useEffect(() => {
    dispatch(workSlice.actions.updateWorkShifts());
  }, [dispatch, workShiftCount]);

  React.useEffect(() => {
    dispatch(workSlice.actions.updateWorkShiftOperators());
  }, [dispatch, operatorsCount]);

  React.useEffect(() => {
    // only for first step
    if (!operatorsCount) {
      handleResetAll();
    }
  }, [dispatch, handleResetAll, operatorsCount]);

  return (
    <Container component="main" maxWidth="lg">
      <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          <MyPaper>
            <Button onClick={handleBackToSetting}>Конфигурация</Button>
            <Button onClick={handleResetAll} color="secondary">
              Сбросить всё
            </Button>
          </MyPaper>

          <MyPaper>
            <WorkShiftStepper />
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
            <OperatorsStopwatch />
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
            <WorkShiftTimeTable />

            <Divider />
            <Button onClick={handleResetTimes} sx={{ mt: 1 }} fullWidth>
              Сбросить прогресс всей смены
            </Button>
          </MyPaper>

          {process.env.NODE_ENV === 'development' && (
            <>
              <Divider />
              <MyPaper>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  <b>DEBUG</b>
                </Typography>
                <Typography component="pre">{JSON.stringify(workState, null, 2)}</Typography>
              </MyPaper>
            </>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <MyPaper>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              <b>График</b>
            </Typography>
            {/* <Typography component="p">скоро здесь будет %%график%%</Typography> */}
            <ChartTimes />
          </MyPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppContainer;
