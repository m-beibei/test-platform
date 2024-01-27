import { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem } from '@mui/material';
import getAllPrice from '../../utils/fetch/getAllPrice';
import getKLineData from '../../utils/fetch/getKLineData';
import { CardData } from '../Card';

type Interval =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w';

interface FilterType {
  interval: Interval; // k线时间间隔
  count: string; // 用来做分析的k线数量，与trend联合， 在k线query里是limit = count + 1
}

interface KCaseOneProps {
  onButtonClick: (filteredSymbols: CardData[]) => void;
}

const defaultFilter: FilterType = {
  interval: '3m',
  count: '20',
};

export default function KCaseOne(props: KCaseOneProps) {
  const { onButtonClick } = props;
  const [filter, setFilter] = useState<FilterType>(defaultFilter);
  const getData = getKLineData;

  const onFilterChange = (value: string | Interval, type: keyof FilterType) => {
    const newFilter = {
      ...filter,
      [type]: value,
    };
    setFilter(newFilter);
  };

  const getListForAll = async () => {
    const allTicks = await getAllPrice();
    let all: {
      symbol: string;
      generalPriceChange: number;
      price: string;
    }[] = [];
    await Promise.all(
      allTicks.map((item) =>
        getData({
          symbol: item.symbol,
          interval: filter.interval,
          limit: filter.count,
        }),
      ),
    ).then((values) => {
      values.forEach((value) => {
        if (value.symbol.slice(-4) === 'USDT') {
          const klines = value.klines || [];
          const length = klines.length;
          const latest = klines[length - 1];
          const last = klines[0];

          const open = Number(last[1]);
          const close = Number(latest[4]);

          const generalPriceChange = (close - open) / open;

          all.push({
            symbol: value.symbol,
            generalPriceChange,
            price: latest[4],
          });
        }
      });
    });

    return all;
  };

  const getListForHighIncrease = async () => {
    const allChangeList = await getListForAll();
    allChangeList.sort((a, b) => b.generalPriceChange - a.generalPriceChange);
    const first20 = allChangeList.slice(0, 20).map((tick) => ({
      detail: `${tick.symbol} - ($${tick.price}) // (${(
        tick.generalPriceChange * 100
      ).toFixed(4)}%)`,
      symbol: tick.symbol,
    }));
    onButtonClick(first20);
  };

  const getListForHighDecrease = async () => {
    const allChangeList = await getListForAll();
    allChangeList.sort((a, b) => a.generalPriceChange - b.generalPriceChange);
    const first20 = allChangeList.slice(0, 20).map((tick) => ({
      detail: `${tick.symbol} - ($${tick.price}) // (${(
        tick.generalPriceChange * 100
      ).toFixed(4)}%)`,
      symbol: tick.symbol,
    }));
    onButtonClick(first20);
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Box sx={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
        <Select
          id="interval-select"
          size="small"
          value={filter.interval}
          label="Interval"
          onChange={(event) => onFilterChange(event.target.value, 'interval')}
          sx={{ marginRight: '5px' }}
        >
          {[
            '1m',
            '3m',
            '5m',
            '15m',
            '30m',
            '1h',
            '2h',
            '4h',
            '6h',
            '8h',
            '12h',
            '1d',
            '3d',
            '1w',
          ].map((i) => (
            <MenuItem value={i} key={i}>
              {i}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Count"
          size="small"
          variant="outlined"
          value={filter.count}
          onChange={(e) => onFilterChange(e.target.value, 'count')}
          sx={{ width: '70px', marginRight: '5px' }}
        />
      </Box>
      <Box marginBottom="5px">
        <Button
          onClick={getListForHighIncrease}
          variant="outlined"
          disabled={Number(filter.count) < 2}
          sx={{ marginRight: '5px' }}
        >
          High I
        </Button>
        <Button
          onClick={getListForHighDecrease}
          variant="outlined"
          disabled={Number(filter.count) < 2}
          sx={{ marginRight: '5px' }}
        >
          High D
        </Button>
      </Box>
    </Box>
  );
}
