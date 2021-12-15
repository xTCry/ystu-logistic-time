import React from 'react';

const useTimer = (initialState = 0) => {
  const [timer, setTimer] = React.useState(initialState);
  const [isActive, setIsActive] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(null);
  const countRef = React.useRef(null);

  const handlePause = React.useCallback(() => {
    if (countRef.current) clearInterval(countRef.current);
    setIsPaused(null);
  }, [countRef, setIsPaused]);

  const handleReset = React.useCallback(
    (resettable = false) => {
      handlePause();
      setIsActive(false);
      if (!resettable || !isPaused) {
        setTimer(0);
      }
    },
    [isPaused,setIsActive, setTimer, handlePause],
  );

  const handleResume = React.useCallback(() => {
    if (countRef.current) clearInterval(countRef.current);
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1e3);
  }, [countRef, setIsPaused]);

  const handleStartPause = React.useCallback(
    (play = false) => {
      setIsActive(true);
      if (!isPaused || play) {
        handleResume();
      } else {
        handlePause();
      }
    },
    [isPaused, setIsActive, handleResume, handlePause],
  );

  return { timer, isActive, isPaused, handleStartPause, handlePause, handleResume, handleReset };
};

export default useTimer;
