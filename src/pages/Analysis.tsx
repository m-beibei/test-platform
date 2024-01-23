import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import VolumePage from '../components/volume/VolumePage';

export default function Analysis() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Volume" />
        </Tabs>
      </Box>
      <Box>
        {value === 0 && <VolumePage />}
      </Box>
    </Box>
  );
}
