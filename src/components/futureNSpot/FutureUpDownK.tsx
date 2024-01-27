import { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Ticker } from './FutureSubscription';

import Card from '../Card';

const getAmplitude = (currentPrice: number, basePrice: number) => {
  return (currentPrice - basePrice) / basePrice;
};

export interface VirtualKLine {
  timestamp: number;
  open: number;
  close: number;
  isUp: boolean;
}

export interface LongTimeMonitorSymbol {
  symbol: string;
  latestPrice: number;
  amp: number;
  klines: VirtualKLine[];
}

interface FutureUpDownKProps {
  data: Ticker[];
  isListening: boolean;
  btcPrice?: string;
}

let allList: Record<string, LongTimeMonitorSymbol> = {};

export default function FutureUpDownK(props: FutureUpDownKProps) {
  const { data, isListening, btcPrice } = props;
  const [upGroup, setUpGroup] = useState<LongTimeMonitorSymbol[]>([]);

  const calculating = () => {
    const now = Date.now();
    data.forEach((tickerData) => {
      const symbol = tickerData.s;
      const latestPrice = parseFloat(tickerData.c);
      const latestTimeStamp = tickerData.E;

      const symbolDetails = allList[symbol];

      if (!symbolDetails) {
        // 存入第一条k线 第一个data
        const firstK = {
          timestamp: latestTimeStamp,
          open: latestPrice,
          close: latestPrice,
          isUp: true,
        };

        allList[symbol] = {
          symbol,
          latestPrice,
          amp: 0,
          klines: [firstK],
        };
      } else {
        const kList = symbolDetails.klines;
        const kCount = kList.length;
        // 计算时间， 最近的k有没有到1分钟，用现在时间now对比
        const latestK = kList[kCount - 1];
        // 超过1分钟，开始新的k线
        if (now - latestK.timestamp > 60000) {
          latestK.close = latestPrice;
          const newK = {
            timestamp: latestTimeStamp,
            open: latestPrice,
            close: latestPrice,
            isUp: true,
          };
          symbolDetails.klines.push(newK);
          // k线数量超过限制 - 8min，删除第一条
          if (symbolDetails.klines.length > 8) {
            symbolDetails.klines.shift();
          }
          symbolDetails.latestPrice = latestPrice;
          symbolDetails.amp =
            getAmplitude(latestPrice, symbolDetails.klines[0].open) * 100;
        } else {
          // 没超过一分钟 开始更新最近一条k
          latestK.close = latestPrice;
          latestK.isUp = latestPrice > latestK.open;
          symbolDetails.latestPrice = latestPrice;
          symbolDetails.amp =
            getAmplitude(latestPrice, symbolDetails.klines[0].open) * 100;
        }
      }
    });

    const up = Object.values(allList)
      .sort((a, b) => b.amp - a.amp)
      .slice(0, 10);
    setUpGroup(up);
  };

  useEffect(() => {
    // 初始化
    setUpGroup([]);
    allList = {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  useEffect(() => {
    calculating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const onOpenBinancePage = (symbol: string) => {
    window.open(`https://www.binance.com/zh-CN/futures/${symbol}`, '_blank');
  };

  const upList = upGroup.map((data) => ({
    detail: `${data.symbol} - ($${data.latestPrice}) // ${data.amp.toFixed(
      2,
    )}%`,
    symbol: data.symbol,
    appendix: (
      <Box display="flex">
        <Box display="flex">
          {data.klines.map((k, index) => (
            <Box
              key={`${data.symbol}-${index}-uplist`}
              width="3px"
              height="20px"
              marginRight="4px"
              sx={{ backgroundColor: k.isUp ? 'green' : 'red' }}
            />
          ))}
        </Box>
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
      <Box sx={{ marginTop: '16px' }}>
        <Card
          title={`Up (L Monitor) // $${btcPrice || ''}`}
          bgColor="#F9D923"
          data={upList}
          noActionButtons
        />
      </Box>
    </Box>
  );
}
