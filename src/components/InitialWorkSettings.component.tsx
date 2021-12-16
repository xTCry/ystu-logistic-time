import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

import workSlice from '../store/reducers/work/work.slice';

const StepsWorkSetting = (props: { activeStep: number }) => {
  const dispatch = useDispatch();
  const { var_T, totalOperatorsCount, workShiftCount } = useSelector((state) => state.work);

  const changeWorkShiftCount = React.useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      let val = event.target.value === '' ? null : Math.max(2, Math.min(Math.floor(+event.target.value), 5));
      dispatch(workSlice.actions.setWorkShiftCount(val));
    },
    [dispatch],
  );

  const changeOperstorsCount = React.useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      let val = event.target.value === '' ? null : Math.max(2, Math.min(Math.floor(+event.target.value), 15));
      dispatch(workSlice.actions.setTotalOperatorsCount(val));
    },
    [dispatch],
  );

  const changeVar_T = React.useCallback(
    (event: React.ChangeEvent<{ value: string }>) => {
      let val = event.target.value === '' ? null : Math.max(1, Math.min(Math.floor(+event.target.value), 9e3));
      dispatch(workSlice.actions.setVar_T(val));
    },
    [dispatch],
  );

  switch (props.activeStep) {
    case 0:
      return (
        <MyPaper>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            <b>Ознакомление</b>
          </Typography>
          <Typography>Проще следить за операторами и вести статистику</Typography>
          <Typography><i>TODO: add reactour</i></Typography>
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
          <FormHelperText>(после изменения данные могут быть утеряны)</FormHelperText>
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
            <FormHelperText>(после изменения данные могут быть утеряны)</FormHelperText>
          </FormControl>
        </MyPaper>
      );

    case 3:
      return (
        <MyPaper>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            <b>Константы и Переменные</b>
          </Typography>
          <Typography component="h6">Время такта</Typography>
          <FormControl fullWidth>
            <Input
              type="number"
              value={var_T}
              onChange={changeVar_T}
              endAdornment={<InputAdornment position="end">сек</InputAdornment>}
            />
          </FormControl>
        </MyPaper>
      );

    default:
      return null;
  }
};

const InitialWorkSettings = (props: { children: any }) => {
  const { children } = props;

  const [activeStep, setActiveStep] = React.useState(0 /* qSteps.length */);

  const handleNext = React.useCallback(() => {
    setActiveStep((v) => ++v);
  }, [setActiveStep]);

  const handleBack = React.useCallback(() => {
    setActiveStep((v) => --v);
  }, [setActiveStep]);

  const handleBackConfiguration = React.useCallback(() => {
    setActiveStep(1);
  }, [setActiveStep]);

  return activeStep < qSteps.length ? (
    <Container component="main" maxWidth="sm">
      <Paper variant="outlined" sx={{ p: { xs: 2 } }}>
        <Typography component="h1" variant="h4" align="center">
          Бережливая настройка
        </Typography>
        <QStepper sx={{ pt: 3, pb: 5 }} activeStep={activeStep} />

        <StepsWorkSetting activeStep={activeStep} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
              Назад
            </Button>
          )}
          <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
            {activeStep === qSteps.length - 1 ? 'Enjoy' : 'Дальше'}
          </Button>
        </Box>
      </Paper>
    </Container>
  ) : (
    React.cloneElement(children, { handleBack: handleBackConfiguration })
  );
};

export default InitialWorkSettings;
