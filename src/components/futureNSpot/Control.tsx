import { useState } from 'react';
import { Box, TextField } from '@mui/material';
import FutureSubscription from './FutureSubscription';

export interface FilterType {
  futureMinutes: string;
  futureUp: string;
  futureBigUp: string;
}

const defaultFilter: FilterType = {
  futureMinutes: '1',
  futureUp: '1',
  futureBigUp: '3',
};

export default function Control() {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterType>(defaultFilter);

  const onFilterChange = (value: string, type: keyof FilterType) => {
    const newFilter = {
      ...filter,
      [type]: value,
    };
    setFilter(newFilter);
  };

  return (
    <Box>
      <Box display="flex" marginBottom="8px">
        <Box marginRight="16px" display="flex" alignItems="center">
          <TextField
            label="f-m"
            size="small"
            variant="outlined"
            value={filter.futureMinutes}
            onChange={(e) => onFilterChange(e.target.value, 'futureMinutes')}
            sx={{ width: '50px', marginRight: '5px' }}
            disabled={isListening}
          />
        </Box>
        <Box marginRight="16px" display="flex" alignItems="center">
          <TextField
            label="f-up"
            size="small"
            variant="outlined"
            value={filter.futureUp}
            onChange={(e) => onFilterChange(e.target.value, 'futureUp')}
            sx={{ width: '50px', marginRight: '5px' }}
            disabled={isListening}
          />
          %
        </Box>
        <Box marginRight="16px" display="flex" alignItems="center">
          <TextField
            label="f-Bup"
            size="small"
            variant="outlined"
            value={filter.futureBigUp}
            onChange={(e) => onFilterChange(e.target.value, 'futureBigUp')}
            sx={{ width: '50px', marginRight: '5px' }}
            disabled={isListening}
          />
          %
        </Box>
      </Box>
      <FutureSubscription filter={filter} setIsListeningCB={setIsListening} />
    </Box>
  );
}
