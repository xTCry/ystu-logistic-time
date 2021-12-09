import React from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';

import QStepper, { qSteps } from './QStepper.component';

import { MyPaper } from '../styled/MyPaper.styled';

const StepsWorkSetting = (props: { activeStep: number; payload: any }) => {
  const {
    payload: { workShiftCount, totalOperatorsCount, setWorkShiftCount, setTotalOperatorsCount },
  } = props;

  const changeWorkShiftCount = React.useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      setWorkShiftCount(Math.max(2, Math.min(Math.floor(+event.target.value), 5)));
    },
    [setWorkShiftCount],
  );

  const changeOperstorsCount = React.useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      setTotalOperatorsCount(Math.max(2, Math.min(Math.floor(+event.target.value), 15)));
    },
    [setTotalOperatorsCount],
  );

  switch (props.activeStep) {
    case 0:
      return (
        <MyPaper>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            <b>Ознакомление</b>
          </Typography>
          <Typography component="h6">Проще следить за операторами и вести статистику</Typography>
        </MyPaper>
      );

    case 1:
      return (
        <MyPaper>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            <b>Смены</b>
          </Typography>
          <Typography component="h6">Выбор количества смен</Typography>
          <FormControl fullWidth>
            <Input type="number" value={workShiftCount} onChange={changeWorkShiftCount} />
          </FormControl>
        </MyPaper>
      );

    case 2:
      return (
        <MyPaper>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            <b>Рабочие места</b>
          </Typography>
          <Typography component="h6">Выбор изначального количества операторов</Typography>
          <FormControl fullWidth>
            <Input
              type="number"
              value={totalOperatorsCount}
              onChange={changeOperstorsCount}
              endAdornment={<InputAdornment position="end">мест</InputAdornment>}
            />
            <FormHelperText>(после повторного изменения данные могут быть утеряны)</FormHelperText>
          </FormControl>
        </MyPaper>
      );

    default:
      return null;
  }
};

const InitialWorkSettings = (props: { children: any }) => {
  const { children } = props;

  const [workShiftCount, setWorkShiftCount] = React.useState(3);
  const [totalOperatorsCount, setTotalOperatorsCount] = React.useState(10);

  const [workShiftStep, setWorkShiftStep] = React.useState(0);
  const [workShiftTotalTimes, setWorkShiftTotalTimes] = React.useState([]);
  // const [workShiftData, setWorkShiftData] = React.useState([]);

  const payload = {
    workShiftCount,
    setWorkShiftCount,
    totalOperatorsCount,
    setTotalOperatorsCount,
    workShiftStep,
    setWorkShiftStep,
    workShiftTotalTimes,
    setWorkShiftTotalTimes,
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = React.useCallback(() => {
    setActiveStep((v) => ++v);
  }, [setActiveStep]);

  const handleBack = React.useCallback(() => {
    setActiveStep((v) => --v);
  }, [setActiveStep]);

  return activeStep < qSteps.length ? (
    <Container component="main" maxWidth="sm">
      <Paper variant="outlined" sx={{ p: { xs: 2 } }}>
        <Typography component="h1" variant="h4" align="center">
          Бережливая настройка
        </Typography>
        <QStepper sx={{ pt: 3, pb: 5 }} activeStep={activeStep} />

        <StepsWorkSetting activeStep={activeStep} payload={payload} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
              Back
            </Button>
          )}
          <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
            {activeStep === qSteps.length - 1 ? 'Enjoy' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  ) : (
    React.cloneElement(children, { payload, handleBack })
  );
};

export default InitialWorkSettings;
