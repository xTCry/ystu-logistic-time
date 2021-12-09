import React from 'react';

const useTimer = (initialState = 0) => {
  const [timer, setTimer] = React.useState(initialState);
  const [isActive, setIsActive] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(null);
  const countRef = React.useRef(null);

  const handlePause = React.useCallback(() => {
    console.log('handlePause', { isActive, isPaused });
    if (countRef.current) clearInterval(countRef.current);
    setIsPaused(null);
  }, [isActive, isPaused, countRef, setIsPaused]);

  const handleReset = React.useCallback(() => {
    console.log('handleReset', { isActive, isPaused });
    handlePause();
    setIsActive(false);
    setTimer(0);
  }, [isActive, isPaused, setIsActive, setTimer, handlePause]);

  const handleResume = React.useCallback(() => {
    console.log('handleResume', { isActive, isPaused });
    if (countRef.current) clearInterval(countRef.current);
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1e3);
  }, [isActive, isPaused, countRef, setIsPaused]);

  const handleStartPause = React.useCallback(
    (play = false) => {
      setIsActive(true);
      console.log('handleStartPause', { isActive, isPaused });

      if (!isPaused || play) {
        handleResume();
      } else {
        handlePause();
      }
    },
    [isActive, isPaused, setIsActive, handleResume, handlePause],
  );

  return { timer, isActive, isPaused, handleStartPause, handlePause, handleResume, handleReset };
};

export default useTimer;
