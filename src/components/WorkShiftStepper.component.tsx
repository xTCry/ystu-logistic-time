import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import SettingWorkShift from './SettingWorkShift.component';

import workSlice from '../store/reducers/work/work.slice';

const WorkShiftStepper = () => {
  const dispatch = useDispatch();
  const workState = useSelector((state) => state.work);
  const { workShifts, workShiftCount, workShiftStep } = workState;

  const workShiftSteps = React.useMemo(
    () => Array.from(Array(workShiftCount)).map((_, e) => `Cмена ${e + 1}`),
    [workShiftCount],
  );

  const [isOpen, setOpen] = React.useState(false);
  const openSettings = React.useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const checkNeedSetting = React.useCallback(
    (step: number) => {
      const operators = workShifts[step]?.operators || [];
      return operators.length < 1 || operators.map((e) => e.parentIds).flat().length < 1;
    },
    [workShifts],
  );

  const handleNextWorkShift = React.useCallback(() => {
    dispatch(workSlice.actions.nextStep());
    if (checkNeedSetting(workShiftStep + 1) /* && workShiftStep > 0 */) {
      const operators = workShifts[workShiftStep /*  - 1 */]?.operators || [];

      dispatch(workSlice.actions.initOperators({ operators }));
      openSettings();
    }
  }, [dispatch, checkNeedSetting, openSettings, workShifts, workShiftStep]);

  const handlePrevWorkShift = React.useCallback(() => {
    dispatch(workSlice.actions.prevStep());
  }, [dispatch]);

  return (
    <>
      <SettingWorkShift {...{ isOpen, handleClose }} />

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
        {workShiftStep > 0 && (
          <Button onClick={openSettings} color="secondary">
            Настройка смены
          </Button>
        )}
        {workShiftStep > 0 && <Button onClick={handlePrevWorkShift}>Пред. этап</Button>}
        {workShiftStep < workShiftCount - 1 ? (
          <Button variant="contained" onClick={handleNextWorkShift}>
            След. этап
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              alert('Wohooh!');
            }}
          >
            Получить отчёт
          </Button>
        )}
      </Box>
    </>
  );
};

export default WorkShiftStepper;
