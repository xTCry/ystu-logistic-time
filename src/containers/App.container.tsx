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
import OperatorNumber from '../components/OperatorNumber.component';

import workSlice from '../store/reducers/work/work.slice';

const AppContainer = (props: { handleBack? }) => {
  const { handleBack: handleBackToSetting } = props;

  const dispatch = useDispatch();
  const workState = useSelector((state) => state.work);
  const { totalOperatorsCount, workShiftCount, workShiftStep, workShifts } = workState;
  const { operators } = workShifts[workShiftStep] || {};
  const operatorsCount = operators?.length;

  const handleResetTimes = React.useCallback(() => {
    dispatch(workSlice.actions.handleResetTimes());
  }, [dispatch]);

  const handleResetAll = React.useCallback(() => {
    dispatch(workSlice.actions.resetAll());
    dispatch(workSlice.actions.updateWorkShifts());
    if (totalOperatorsCount) {
      dispatch(workSlice.actions.updateWorkShiftOperators());
    }
  }, [dispatch, totalOperatorsCount]);

  React.useEffect(() => {
    workShiftCount && dispatch(workSlice.actions.updateWorkShifts());
  }, [dispatch, workShiftCount]);

  React.useEffect(() => {
    if (totalOperatorsCount) {
      dispatch(workSlice.actions.updateWorkShiftOperators());
    }
  }, [dispatch, workShiftCount, totalOperatorsCount, operatorsCount]);

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
            <Button onClick={handleBackToSetting}>????????????????????????</Button>
            <Button onClick={handleResetAll} color="secondary">
              ???????????????? ??????
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
            <Typography component="h6">?????????????????? ???????????? ?? ?????????? ???????????????????? ???????????? ??????????????????</Typography>
          </MyPaper>
          <MyPaper>
            <OperatorsStopwatch />
          </MyPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <MyPaper>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              <b>??????????????</b>
            </Typography>
            <Typography component="p">
              ?????????????? ?????????? ???????????? ???????????????????? <b>{workShiftStep + 1}</b> ??????????
            </Typography>
            <WorkShiftTimeTable />

            <Divider />
            <Button onClick={handleResetTimes} sx={{ mt: 1 }} fullWidth>
              ???????????????? ???????????????? ???????? ??????????
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
              <b>????????????</b>
            </Typography>
            {/* <Typography component="p">?????????? ?????????? ?????????? %%????????????%%</Typography> */}
            <ChartTimes />

            <Divider sx={{ my: 2 }} />
            <OperatorNumber />
          </MyPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppContainer;
