export const formatTime = (timer: number) => {
  const seconds = timer % 60;
  const minutes = Math.floor((timer / 60) % 60);
  const hours = Math.floor(timer / 3600);

  return [...(!!hours ? [hours] : []), minutes, seconds].map((e) => String(e).padStart(2, '0')).join(' : ');
};
