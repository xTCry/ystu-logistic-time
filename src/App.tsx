import React from 'react';
import * as ReactU from 'react-use';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import InputAdornment from '@mui/material/InputAdornment';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { experimentalStyled as styled } from '@mui/material/styles';

import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

import QStepper, { qSteps } from './components/QStepper.component';
import Stopwatch from './components/Stopwatch.component';
import Footer from './components/Footer.component';

import { formatTime } from './utils';

const MyPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(2),
  margin: theme.spacing?.(1),
}));

const SettingWorks = (props: { activeStep: number; payload: any }) => {
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

const WorkShiftTimeTable = (props: { rows: any[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Оператор №</TableCell>
            <TableCell>N</TableCell>
            <TableCell align="right">AVG</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.times.length}</TableCell>
              <TableCell align="right">
                {formatTime(Math.floor(row.times.reduce((a, b) => a + b, 0) / row.times.length))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const AppContent = (props: { handleBack; payload: any }) => {
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
    <>
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
    </>
  );
};

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const [activeSettingStep, setActiveSettingStep] = React.useState(0);
  const [workShiftCount, setWorkShiftCount] = React.useState(3);
  const [totalOperatorsCount, setTotalOperatorsCount] = React.useState(10);

  const [workShiftStep, setWorkShiftStep] = React.useState(0);
  const [workShiftTotalTimes, setWorkShiftTotalTimes] = React.useState([]);
  // const [workShiftData, setWorkShiftData] = React.useState([]);

  const handleNext = React.useCallback(() => {
    setActiveSettingStep((v) => ++v);
  }, [setActiveSettingStep]);

  const handleBack = React.useCallback(() => {
    setActiveSettingStep((v) => --v);
  }, [setActiveSettingStep]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Logistic Time
          </Typography>
        </Toolbar>
      </AppBar>

      {activeSettingStep < qSteps.length ? (
        <Container component="main" maxWidth="sm">
          <Paper variant="outlined" sx={{ mt: { xs: 3 }, p: { xs: 2 } }}>
            <Typography component="h1" variant="h4" align="center">
              Бережливая настройка
            </Typography>
            <QStepper sx={{ pt: 3, pb: 5 }} activeStep={activeSettingStep} />

            <SettingWorks activeStep={activeSettingStep} payload={payload} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {activeSettingStep !== 0 && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>
              )}
              <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                {activeSettingStep === qSteps.length ? 'Enjoy' : 'Next'}
              </Button>
            </Box>
          </Paper>
        </Container>
      ) : (
        <Container component="main" maxWidth="lg">
          <Box pt={4}>
            <AppContent handleBack={handleBack} payload={payload} />
          </Box>
        </Container>
      )}

      <Footer />
    </ThemeProvider>
  );
};

export default App;
