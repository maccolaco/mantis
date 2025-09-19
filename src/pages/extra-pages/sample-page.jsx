// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <Box sx={{ p: 3 }}>
      <MainCard title="Welcome">
        <Typography variant="h4" gutterBottom>
          Dashboard Template
        </Typography>
        <Typography variant="body1" paragraph>
          This is a clean dashboard template with sidebar navigation and user profile functionality.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The sidebar can be collapsed/expanded, and the user profile dropdown provides access to settings and logout functionality.
        </Typography>
      </MainCard>
    </Box>
  );
}