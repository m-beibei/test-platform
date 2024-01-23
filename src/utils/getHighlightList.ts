import getKLineData from '../utils/fetch/getKLineData';
import { getStrategyRes, StrategyRes } from './strategy';
import { TickerPrice } from '../utils/fetch/getAllPrice';

export interface HighlightList extends StrategyRes {
  symbol: string;
}

let upFast1MinGroup: HighlightList[] = [];
let downFast1MinGroup: HighlightList[] = [];
let upFast3MinGroup: HighlightList[] = [];

const getKlines = async (item: TickerPrice) => {
  const klines = await getKLineData({
    symbol: item.symbol,
    interval: '1m',
    limit: '5',
  });

  return klines;
};

export const getHighlightList = async (
  list: TickerPrice[],
  amplitude1minUp: string,
  amplitude1minDown: string,
  amplitude3minUp: string,
) => {
  if (list && !!list.length) {
    await Promise.all(list.map((item) => getKlines(item))).then((values) => {
      values.forEach((value) => {
        const res = getStrategyRes(
          value.klines,
          amplitude1minUp,
          amplitude1minDown,
          amplitude3minUp,
        );
        upFast1MinGroup = upFast1MinGroup.filter(
          (data) => data.symbol !== value.symbol,
        );
        downFast1MinGroup = downFast1MinGroup.filter(
          (data) => data.symbol !== value.symbol,
        );
        upFast3MinGroup = upFast3MinGroup.filter(
          (data) => data.symbol !== value.symbol,
        );

        if (res.isUpFast) {
          upFast1MinGroup.push({ ...res, symbol: value.symbol });
        }

        if (res.isDownFast) {
          downFast1MinGroup.push({ ...res, symbol: value.symbol });
        }

        if (res.isTrendUpFast) {
          upFast3MinGroup.push({ ...res, symbol: value.symbol });
        }
      });
    });
  }

  return {
    upFast1MinGroup,
    downFast1MinGroup,
    upFast3MinGroup,
  };
};

export const continueGetHighlightList = async (
  list: TickerPrice[],
  amplitude1minUp: string,
  amplitude1minDown: string,
  amplitude3minUp: string,
) => {
  const res = await getHighlightList(
    list,
    amplitude1minUp,
    amplitude1minDown,
    amplitude3minUp,
  );

  return res;
};

export default continueGetHighlightList;
