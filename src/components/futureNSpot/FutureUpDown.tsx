import { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Card from '../Card';
import { Ticker, HighlightSymbol } from './FutureSubscription';
import { FilterType } from './Control';

const getAmplitude = (currentPrice: number, basePrice: number) => {
  return (currentPrice - basePrice) / basePrice;
};

interface QuickUpDownProps {
  data: Ticker[];
  filterData: FilterType;
  isBigMode?: boolean;
}

let newUpFastGroup: { symbolData: HighlightSymbol; time: number }[] = [];
let newBigUpFastGroup: { symbolData: HighlightSymbol; time: number }[] = [];
let allList: Record<string, { price: number; timestamp: number }> = {};

export default function QuickUpDown(props: QuickUpDownProps) {
  const { data, filterData, isBigMode } = props;
  const [filter, setFilter] = useState(filterData);
  const [upFastGroup, setUpFastGroup] = useState<HighlightSymbol[]>([]);
  const [bigUpFastGroup, setBigUpFastGroup] = useState<HighlightSymbol[]>([]);

  const calculating = () => {
    data.forEach((tickerData) => {
      const symbol = tickerData.s;
      const latestPrice = parseFloat(tickerData.c);
      const latestTimeStamp = tickerData.E;

      const now = Date.now();

      newUpFastGroup = newUpFastGroup.filter((item) => {
        return item.symbolData.symbol !== symbol || now - item.time < 60000;
      });

      newBigUpFastGroup = newBigUpFastGroup.filter((item) => {
        return item.symbolData.symbol !== symbol || now - item.time < 60000;
      });

      if (
        !allList[symbol] ||
        latestTimeStamp - allList[symbol].timestamp >
          Number(filter.futureMinutes) * 60000
      ) {
        allList[symbol] = {
          price: latestPrice,
          timestamp: latestTimeStamp,
        };
      }

      const amp = getAmplitude(latestPrice, allList[symbol].price) * 100;

      const currentInUp = newUpFastGroup.find(
        (up) => up.symbolData.symbol === symbol,
      );
      const currentInBigUp = newBigUpFastGroup.find(
        (up) => up.symbolData.symbol === symbol,
      );

      if (currentInUp) {
        currentInUp.symbolData = { symbol, price: latestPrice, amp };
      }
      if (currentInBigUp) {
        currentInBigUp.symbolData = { symbol, price: latestPrice, amp };
      }

      //先过滤big up
      if (amp > Number(filter.futureBigUp)) {
        if (!currentInBigUp) {
          newBigUpFastGroup.push({
            symbolData: { symbol, price: latestPrice, amp },
            time: now,
          });
        }
      } else {
        if (amp > Number(filter.futureUp)) {
          if (!currentInUp) {
            newUpFastGroup.push({
              symbolData: { symbol, price: latestPrice, amp },
              time: now,
            });
          }
        }
      }

      setUpFastGroup(newUpFastGroup.map((up) => up.symbolData));
      setBigUpFastGroup(newBigUpFastGroup.map((up) => up.symbolData));
    });
  };

  useEffect(() => {
    setFilter(filterData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData.futureUp, filterData.futureMinutes]);

  useEffect(() => {
    calculating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const onOpenBinancePage = (symbol: string) => {
    window.open(`https://www.binance.com/zh-CN/futures/${symbol}`, '_blank');
  };

  const upFastList = upFastGroup
    .sort((a, b) => b.amp - a.amp)
    .map((data) => ({
      detail: `${data.symbol} - ($${data.price}) // ${data.amp.toFixed(2)}%`,
      symbol: data.symbol,
      appendix: (
        <Box display="flex">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onOpenBinancePage(data.symbol);
            }}
            sx={{ padding: '2px' }}
          >
            <AttachMoneyIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      ),
    }));
  const bigUpFastList = bigUpFastGroup
    .sort((a, b) => b.amp - a.amp)
    .map((data) => ({
      detail: `${data.symbol} - ($${data.price}) // ${data.amp.toFixed(2)}%`,
      symbol: data.symbol,
      appendix: (
        <Box display="flex">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onOpenBinancePage(data.symbol);
            }}
            sx={{ padding: '2px' }}
          >
            <AttachMoneyIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      ),
    }));

  return (
    <Box>
      <Card
        title="Future Up"
        bgColor="#A367B1"
        data={upFastList}
        bigMode={isBigMode}
        noActionButtons
      />
      <Card
        title="Future Big Up"
        bgColor="#5D3587"
        data={bigUpFastList}
        bigMode={isBigMode}
        noActionButtons
      />
    </Box>
  );
}
