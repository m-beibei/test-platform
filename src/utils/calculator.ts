const isUp = (kline: string[]) => {
  return Number(kline[4]) > Number(kline[1]);
};

const isDown = (kline: string[]) => {
  return Number(kline[1]) > Number(kline[4]);
};

const getAmplitude = (kline: string[]) => {
  const high = Number(kline[2]);
  const low = Number(kline[3]);
  const base = isUp(kline) ? low : high;
  return (high - low) / base;
};

export { isUp, isDown, getAmplitude };
