import { useState } from 'react';
import { Box } from '@mui/material';
import KCaseOne from './KCaseOne';
import KCaseTwo from './KCaseTwo';
import Card, { CardData } from '../Card';

export default function KAnalysisPage() {
  const [filteredList, setFilteredList] = useState<CardData[]>([]);

  const onButtonClick = (filteredSymbols: CardData[]) => {
    setFilteredList(filteredSymbols);
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <KCaseOne onButtonClick={onButtonClick} />
      <KCaseTwo onButtonClick={onButtonClick} />

      <Box sx={{ marginTop: '20px' }}>
        <Card title="" bgColor="#D989B5" data={filteredList} />
      </Box>
    </Box>
  );
}
