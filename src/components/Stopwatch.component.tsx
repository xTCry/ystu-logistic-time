import React from 'react';
import * as ReactU from 'react-use';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
// import RestartIcon from '@mui/icons-material/RestartAlt';
import RestartIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';

import { experimentalStyled as styled } from '@mui/material/styles';

import useTimer from '../hooks/useTimer.hook';
import { formatTime } from '../utils';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Stopwatch = (props: {
  id: number;
  onSave?: Function;
  simple?: boolean;
  savable?: boolean;
  onStartAll?: boolean;
  onStopAll?: boolean;
}) => {
  const { id, simple, savable, onSave, onStartAll, onStopAll } = props;
  const { timer, isActive, isPaused, handleStart, handlePause, handleResume, handleReset } = useTimer(0);

  const handleSave = React.useCallback(() => {
    onSave?.(id, timer);
    handleReset();
    handleStart();
  }, [id, timer, onSave, handleReset, handleStart]);

  const prevOnStartAll = ReactU.usePrevious(onStartAll);
  const prevOnStopAll = ReactU.usePrevious(onStopAll);
  React.useEffect(() => {
    if (prevOnStartAll !== undefined && onStartAll !== prevOnStartAll && !isActive && !isPaused) {
      handleStart();
    }
  }, [handleStart, onStartAll, prevOnStartAll, isActive, isPaused]);

  React.useEffect(() => {
    if (prevOnStopAll !== undefined && onStopAll !== prevOnStopAll) {
      handleReset();
    }
  }, [handleReset, onStopAll, prevOnStopAll, isActive, isPaused]);

  return (
    <Grid item>
      <Item sx={(theme) => ({ px: { xs: 0, md: theme.spacing(2) } })}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {formatTime(timer)}
        </Typography>
        <ButtonGroup disableElevation>
          <Button disabled>
            <Typography color="green">
              <b>{id}</b>
            </Typography>
          </Button>
          {!isActive && !isPaused ? (
            <Button onClick={handleStart} color="info" endIcon={!simple && <PlayArrowIcon />}>
              {simple ? <PlayArrowIcon /> : 'Start'}
            </Button>
          ) : isPaused ? (
            <Button onClick={handlePause} color="warning" endIcon={!simple && <PauseIcon />}>
              {simple ? <PauseIcon /> : 'Pause'}
            </Button>
          ) : (
            <Button onClick={handleResume} color="secondary" endIcon={!simple && <PlayArrowIcon />}>
              {simple ? <PlayArrowIcon /> : 'Resume'}
            </Button>
          )}
          {savable && (!isActive || isPaused) ? (
            <Button onClick={handleSave} disabled={!isActive} color="success" endIcon={!simple && <SaveIcon />}>
              {simple ? <SaveIcon /> : 'Save'}
            </Button>
          ) : (
            <Button onClick={handleReset} disabled={!isActive} color="error" endIcon={!simple && <RestartIcon />}>
              {simple ? <RestartIcon /> : 'Reset'}
            </Button>
          )}
        </ButtonGroup>
      </Item>
    </Grid>
  );
};
export default Stopwatch;
