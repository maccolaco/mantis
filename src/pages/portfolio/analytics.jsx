import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// project imports
import RiskDashboard from 'components/risk/RiskDashboard';
import ReportGenerator from 'components/reports/ReportGenerator';
import { usePortfolio } from 'contexts/PortfolioContext';

// assets
import { FileTextOutlined } from '@ant-design/icons';

export default function PortfolioAnalytics() {
  const { currentPortfolio } = usePortfolio();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  if (!currentPortfolio) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h4" gutterBottom>
                Advanced Risk Analytics
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Upload a portfolio to access comprehensive risk analysis, stress testing, and advisory insights.
              </Typography>
              <Button
                variant="contained"
                href="/portfolio/dashboard"
                size="large"
              >
                Upload Portfolio
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Report Generation */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Advanced Risk Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive risk analysis for {currentPortfolio.name}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<FileTextOutlined />}
              onClick={() => setReportDialogOpen(true)}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Risk Dashboard */}
      <RiskDashboard />

      {/* Report Generator Dialog */}
      <ReportGenerator
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      />
    </Box>
  );
}