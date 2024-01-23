import { isUp, isDown, getAmplitude } from './calculator';

/** k线数据概览例子
 * [
    1499040000000,      // k[0] - k线开盘时间
    "0.01634790",       // k[1] - 开盘价
    "0.80000000",       // k[2] - 最高价
    "0.01575800",       // k[3] - 最低价
    "0.01577100",       // k[4] - 收盘价(当前K线未结束的即为最新价)
    "148976.11427815",  // k[5] - 成交量
    1499644799999,      // k[6] - k线收盘时间
    "2434.19055334",    // k[7] - 成交额
    308,                // k[8] - 成交笔数
    "1756.87402397",    // k[9] - 主动买入成交量
    "28.46694368",      // k[10] - 主动买入成交额
    "17928899.62484339" // k[11] - 请忽略该参数
  ]
*/

export interface StrategyRes {
  isUpFast: boolean; // 1分钟k线暴涨
  isDownFast: boolean; // 1分钟k线暴跌
  isTrendUpFast: boolean; // 3分钟k线暴涨
  latestPrice: string; // 当前价格
  times1minUp: number; // 1分钟up幅度
  times1minDown: number; // 1分钟down幅度
  times3minUp: number; // 3分钟幅度
}

export const getStrategyRes = (
  klineData: string[][],
  amplitude1minUp: string,
  amplitude1minDown: string,
  amplitude3minUp: string,
) => {
  const length = klineData.length;
  const latest = klineData[length - 1];
  const lastSec = klineData[length - 2];
  const lastThird = klineData[length - 3];

  let res: StrategyRes = {
    isUpFast: false,
    isDownFast: false,
    isTrendUpFast: false,
    latestPrice: latest[4],
    times1minUp: 0,
    times1minDown: 0,
    times3minUp: 0,
  };

  //突然暴涨或者暴跌，最后一根阳线插针或者大振幅
  const amplitude = getAmplitude(latest);
  //因为有loading的间隔 倒数第二根也要验证一下
  const lastSecAmplitude = getAmplitude(lastSec);

  if (
    (isUp(latest) && amplitude > Number(amplitude1minUp) / 100) ||
    (isUp(lastSec) && lastSecAmplitude > Number(amplitude1minUp) / 100)
  ) {
    res = {
      ...res,
      isUpFast: true,
      times1minUp: Math.max(amplitude, lastSecAmplitude),
    };
  }

  if (
    (isDown(latest) && amplitude > Number(amplitude1minDown) / 100) ||
    (isDown(lastSec) && lastSecAmplitude > Number(amplitude1minDown) / 100)
  ) {
    res = {
      ...res,
      isDownFast: true,
      times1minDown: Math.max(amplitude, lastSecAmplitude),
    };
  }

  // 3分钟内涨跌变化比例
  const latestClose = Number(latest[4]);
  const lastThirdOpen = Number(lastThird[1]);
  const changeRatio = (latestClose - lastThirdOpen) / lastThirdOpen;

  // 3分钟内涨幅多
  if (changeRatio > Number(amplitude3minUp) / 100) {
    res = {
      ...res,
      isTrendUpFast: true,
      times3minUp: changeRatio,
    };
  }

  return res;
};
