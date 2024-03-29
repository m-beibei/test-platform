import { useState } from 'react';
import { Box } from '@mui/material';
import KCaseOne from './KCaseOne';
import KCaseTwo from './KCaseTwo';
import KCaseThree from './KCaseThree';
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
      <KCaseThree onButtonClick={onButtonClick} />

      <Box sx={{ marginTop: '20px' }}>
        <Card title="" bgColor="#37B5B6" data={filteredList} />
      </Box>
    </Box>
  );
}
