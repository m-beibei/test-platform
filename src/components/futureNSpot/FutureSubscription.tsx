import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import FutureUpDown from './FutureUpDown';
import FutureUpDownK from './FutureUpDownK';
import { FilterType } from './Control';

export interface Ticker {
  e: string; // 事件类型
  E: number; // 事件时间 毫秒
  s: string; // 交易对 symbol
  p: string; // 24小时价格变化
  P: string; // 24小时价格变化(百分比)
  w: string; // 平均价格
  c: string; // 最新成交价格 price
  Q: string; // 最新成交价格上的成交量
  o: string; // 24小时内第一比成交的价格
  h: string; // 24小时内最高成交价
  l: string; // 24小时内最低成交价
  v: string; // 24小时内成交量
  q: string; // 24小时内成交额
  O: number; // 统计开始时间
  C: number; // 统计结束时间
  F: number; // 24小时内第一笔成交交易ID
  L: number; // 24小时内最后一笔成交交易ID
  n: number; // 24小时内成交数
}

export interface HighlightSymbol {
  symbol: string;
  price: number;
  amp: number;
}

interface FutureSubscriptionProps {
  filter: FilterType;
  setIsListeningCB: (isListening: boolean) => void;
}

export default function FutureSubscription(props: FutureSubscriptionProps) {
  const { filter, setIsListeningCB } = props;
  let ws: WebSocket | null = null; // WebSocket连接的变量
  const [isListening, setIsListening] = useState<boolean>(false);
  const [messageData, setMessageData] = useState<Ticker[]>([]);
  const [btcPrice, setBtcPrice] = useState<string>('');
  const [viewingSymbol, setViewingSymbol] = useState<string>();
  const [bigModeOn, setBigModeOn] = useState<boolean>(false);

  const startListening = () => {
    ws = new WebSocket(`wss://fstream.binance.com/stream?streams=!ticker@arr`);
    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) || {};

      if (data.stream === '!ticker@arr') {
        const updatedMiniTickerList: Ticker[] = data.data;
        setMessageData(updatedMiniTickerList);

        updatedMiniTickerList.forEach((tickerData) => {
          const symbol = tickerData.s;

          if (symbol === 'BTCUSDT') {
            setBtcPrice(tickerData.c);
          }
        });
      }
    };
    ws.onclose = () => {
      console.log('WebSocket closed');
    };
    setIsListening(true); // 标记为正在监听
    setIsListeningCB(true);
  };

  const stopListening = () => {
    if (ws) {
      ws.close();
      setIsListening(false); // 标记为停止监听
      setIsListeningCB(false);
    }
  };

  useEffect(() => {
    if (isListening) {
      startListening();
    } else {
      stopListening();
    }
    // 在组件卸载时关闭WebSocket连接
    return () => {
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontSize="14px">{`BTC - $${btcPrice}`}</Typography>
        <Button
          onClick={() => setIsListening(!isListening)}
          disabled={
            !filter.futureMinutes ||
            !filter.futureUp ||
            !filter.futureBigUp
          }
        >
          {isListening ? '停止监听' : '开始监听'}
        </Button>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={bigModeOn}
                onChange={(e) => setBigModeOn(e.target.checked)}
              />
            }
            label="B"
          />
        </FormGroup>
      </Box>

      <FutureUpDown
        isBigMode={bigModeOn}
        filterData={filter}
        data={messageData}
        onItemClick={setViewingSymbol}
      />
      <FutureUpDownK
        data={messageData}
        onItemClick={setViewingSymbol}
        isListening={isListening}
        btcPrice={btcPrice}
      />
    </Box>
  );
}
