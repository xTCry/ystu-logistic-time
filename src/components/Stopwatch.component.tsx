import React from 'react';
import * as ReactU from 'react-use';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
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
  id?: number;
  onSave?: Function;
  simple?: boolean;
  savable?: boolean;
  onGlobalHandlers?: { onStartAll?: boolean; onStopAll?: boolean };
}) => {
  const { id = null, simple, savable, onSave, onGlobalHandlers = {} } = props;
  const { onStartAll, onStopAll } = onGlobalHandlers;
  const { timer, isActive, isPaused, handleStartPause, handleReset } = useTimer(0);

  const handleSave = React.useCallback(() => {
    onSave?.(id, timer);
    handleReset();
    handleStartPause(true);
  }, [id, timer, onSave, handleReset, handleStartPause]);

  const prevOnStartAll = ReactU.usePrevious(onStartAll);
  const prevOnStopAll = ReactU.usePrevious(onStopAll);
  React.useEffect(() => {
    if (prevOnStartAll !== undefined && onStartAll !== prevOnStartAll) {
      handleStartPause();
    }
  }, [handleStartPause, onStartAll, prevOnStartAll, isActive, isPaused]);

  React.useEffect(() => {
    if (prevOnStopAll !== undefined && onStopAll !== prevOnStopAll) {
      handleReset(true);
    }
  }, [handleReset, onStopAll, prevOnStopAll, isActive, isPaused]);

  const param =
    !isActive && !isPaused
      ? { color: 'info', title: 'Start', icon: <PlayArrowIcon /> }
      : isPaused
      ? { color: 'warning', title: 'Pause', icon: <PauseIcon /> }
      : { color: 'secondary', title: 'Resume', icon: <PlayArrowIcon /> };

  return (
    <Item sx={(theme) => ({ px: { xs: theme.spacing(1) } })}>
      <Typography component="h2" variant="h6" color="primary">
        {id !== null && (
          <Typography color="green">
            <b>{id}</b>
          </Typography>
        )}
        {formatTime(timer)}
      </Typography>

      <ButtonGroup disableElevation>
        <Button onClick={() => handleStartPause()} color={param.color as any} endIcon={!simple && param.icon}>
          {simple ? param.icon : param.title}
        </Button>

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
  );
};
export default Stopwatch;
