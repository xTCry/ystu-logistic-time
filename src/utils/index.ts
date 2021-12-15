export const formatTime = (timer: number) => {
  const seconds = timer % 60;
  const minutes = Math.floor((timer / 60) % 60);
  const hours = Math.floor(timer / 3600);

  return [...(!!hours ? [hours] : []), minutes, seconds].map((e) => String(e).padStart(2, '0')).join(' : ');
};

export const declOfNum = (n: number, titles: string[]) =>
  titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
