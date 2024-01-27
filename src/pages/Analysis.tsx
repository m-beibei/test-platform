import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import VolumePage from '../components/volume/VolumePage';
import DayPage from '../components/day/DayPage';
import PickPage from '../components/pick/PickPage';
import KAnalysisPage from '../components/kAnalysis/KAnalysisPage';

export default function Analysis() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Day" />
          <Tab label="K" />
          <Tab label="Volume" />
          <Tab label="Pick" />
        </Tabs>
      </Box>
      <Box>
        {value === 0 && <DayPage />}
        {value === 1 && <KAnalysisPage />}
        {value === 2 && <VolumePage />}
        {value === 3 && <PickPage />}
      </Box>
    </Box>
  );
}
