import React from 'react';
import * as ReactU from 'react-use';

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

import Stopwatch from './Stopwatch.component';
import WorkShiftTimeTable from './WorkShiftTimeTable.component';

const AppContent = (props: { handleBack?; payload?: any }) => {
  const {
    handleBack: handleBackToSetting,
    payload: {
      workShiftCount,
      totalOperatorsCount,
      workShiftStep,
      setWorkShiftStep,
      workShiftTotalTimes,
      setWorkShiftTotalTimes,
    },
  } = props;

  const workShiftSteps = React.useMemo(
    () => Array.from(Array(workShiftCount)).map((_, e) => `Cмена ${e + 1}`),
    [workShiftCount],
  );

  const onEnd = React.useCallback(
    (id: number, timer: number) => {
      setWorkShiftTotalTimes((data) => {
        if (!Array.isArray(data[workShiftStep][id - 1])) {
          data[workShiftStep][id - 1] = [];
        }
        data[workShiftStep][id - 1].push(timer);
        return [...data];
      });
    },
    [workShiftStep, setWorkShiftTotalTimes],
  );

  const handleNextWorkShift = React.useCallback(() => {
    setWorkShiftStep((e) => ++e);
  }, [setWorkShiftStep]);

  const handlePrevWorkShift = React.useCallback(() => {
    setWorkShiftStep((e) => --e);
  }, [setWorkShiftStep]);

  const handleResetTimes = React.useCallback(() => {
    setWorkShiftTotalTimes((data) => {
      data[workShiftStep] = [];
      return [...data];
    });
  }, [workShiftStep, setWorkShiftTotalTimes]);

  const updateWorkShiftTimes = React.useCallback(() => {
    if (workShiftTotalTimes.length > workShiftCount) {
      setWorkShiftTotalTimes((data) => data.slice(0, workShiftCount));
    } else if (workShiftTotalTimes.length < workShiftCount) {
      setWorkShiftTotalTimes((data) => [...data, ...Array.from(Array(workShiftCount - data.length)).map((e) => [])]);
    }
  }, [workShiftTotalTimes, workShiftCount, setWorkShiftTotalTimes]);

  const [onStartAll, handleStartPauseAll] = ReactU.useToggle(false);
  const [onStopAll, handleStopAll] = ReactU.useToggle(false);

  React.useEffect(() => {
    updateWorkShiftTimes();
  }, [workShiftCount, setWorkShiftTotalTimes, updateWorkShiftTimes]);

  React.useEffect(() => {
    updateWorkShiftTimes();
  }, [updateWorkShiftTimes]);

  const tableRows = workShiftTotalTimes[workShiftStep]?.map((e, i) => ({ id: i + 1, times: e })) || [];

  return (
    <Container component="main" maxWidth="lg">
      <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          <MyPaper>
            <Button onClick={handleBackToSetting}>Back to setting</Button>
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
              {workShiftStep > 0 && <Button onClick={handlePrevWorkShift}>Back</Button>}
              {workShiftStep < workShiftCount - 1 ? (
                <Button variant="contained" onClick={handleNextWorkShift}>
                  Next
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
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              <b>Секундомер</b>
            </Typography>
            {/* <Typography component="h6" mb={1}>
                Работа операторов
              </Typography> */}

            <ButtonGroup disableElevation sx={{ mb: 1 }} fullWidth>
              <Button onClick={handleStartPauseAll} color="secondary" endIcon={<PlayIcon />}>
                Start Or Pause All
              </Button>
              <Button onClick={handleStopAll} color="error" endIcon={<StopIcon />}>
                Stop All
              </Button>
            </ButtonGroup>

            <Grid container justifyContent="center" spacing={{ xs: 1, md: 3 }} columns={3}>
              {Array.from(Array(totalOperatorsCount)).map((_, index) => (
                <Stopwatch
                  key={index}
                  id={index + 1}
                  onSave={onEnd}
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
            {/* <Typography component="p">{JSON.stringify(workShiftTotalTimes)}</Typography> */}
            <WorkShiftTimeTable rows={tableRows} />

            <Divider />
            <Button onClick={handleResetTimes} sx={{ mt: 1 }} fullWidth>
              Сбросить прогресс смены
            </Button>
          </MyPaper>
        </Grid>
      </Grid>

      {
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
      }
    </Container>
  );
};

export default AppContent;
