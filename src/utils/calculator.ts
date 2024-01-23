const isUp = (kline: string[]) => {
  // 如果收盘价大于开盘价，说明上涨
  return Number(kline[4]) > Number(kline[1]);
};

const isDown = (kline: string[]) => {
  // 如果开盘价大于收盘价，说明下跌
  return Number(kline[1]) > Number(kline[4]);
};

//计算振幅 最高价 最低价的比例
const getAmplitude = (kline: string[]) => {
  const high = Number(kline[2]);
  const low = Number(kline[3]);
  const base = isUp(kline) ? low : high;
  return (high - low) / base;
};

const isUpNeedle = (kline: string[]) => {
  // const open = Number(kline[1])
  const close = Number(kline[4]);
  const high = Number(kline[2]);
  const low = Number(kline[3]);
  if (isUp(kline)) {
    const highCloseDiff = high - close;
    const highLowDiff = high - low;

    return highLowDiff / highCloseDiff > 2;
  }

  return false;
};

export { isUp, isDown, isUpNeedle, getAmplitude };
