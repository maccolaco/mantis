import { useState, useEffect } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// project imports
import { usePortfolio } from 'contexts/PortfolioContext';
import PortfolioUpload from 'components/portfolio/PortfolioUpload';
import PortfolioTable from 'components/portfolio/PortfolioTable';
import RiskMetrics from 'components/portfolio/RiskMetrics';
import SectorAllocation from 'components/portfolio/SectorAllocation';
import PortfolioPerformance from 'components/portfolio/PortfolioPerformance';
import MainCard from 'components/MainCard';
import portfolioService from 'services/portfolioService';
import marketDataService from 'services/marketDataService';

// assets
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';

export default function PortfolioDashboard() {
  const { 
    currentPortfolio, 
    liveData, 
    riskMetrics, 
    preferences, 
    loading, 
    dispatch, 
    actions 
  } = usePortfolio();
  
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Set refresh interval to 10 seconds
  const REFRESH_INTERVAL = 10000; // 10 seconds

  // Auto-refresh live data
  useEffect(() => {
    let interval;
    
    if (currentPortfolio?.holdings?.length) {
      // Initial load
      refreshLiveData();
      
      // Set up interval
      interval = setInterval(() => {
        refreshLiveData();
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentPortfolio]);

  // Calculate risk metrics when portfolio or live data changes
  useEffect(() => {
    if (currentPortfolio) {
      const metrics = portfolioService.calculateRiskMetrics(currentPortfolio, liveData);
      dispatch({ type: actions.UPDATE_RISK_METRICS, payload: metrics });
    }
  }, [currentPortfolio, liveData, dispatch, actions]);

  const refreshLiveData = async () => {
    if (!currentPortfolio?.holdings?.length) return;

    setRefreshing(true);
    try {
      const symbols = currentPortfolio.holdings.map(h => h.symbol);
      const newLiveData = await marketDataService.getPrices(symbols);
      
      dispatch({ type: actions.UPDATE_LIVE_DATA, payload: newLiveData });
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing live data:', error);
      dispatch({ type: actions.SET_ERROR, payload: 'Failed to refresh live data' });
    } finally {
      setRefreshing(false);
    }
  };

  const handleUploadComplete = (portfolio) => {
    dispatch({ type: actions.SET_CURRENT_PORTFOLIO, payload: portfolio });
  };

  const handleExportReport = () => {
    // TODO: Implement PDF/Excel export
    console.log('Export report functionality to be implemented');
  };

  const handleRemovePortfolio = () => {
    if (window.confirm('Are you sure you want to remove this portfolio? This action cannot be undone.')) {
      dispatch({ type: actions.SET_CURRENT_PORTFOLIO, payload: null });
      dispatch({ type: actions.UPDATE_RISK_METRICS, payload: null });
      dispatch({ type: actions.UPDATE_LIVE_DATA, payload: {} });
    }
  };
  if (!currentPortfolio) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h4" gutterBottom>
                  Portfolio Risk Management
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Upload your portfolio to start analyzing risk metrics and performance.
                </Typography>
              </Box>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={8} lg={6} sx={{ mx: 'auto' }}>
            <PortfolioUpload onUploadComplete={handleUploadComplete} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <MainCard>
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              justifyContent="space-between" 
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={2}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {currentPortfolio.name}
                </Typography>
                {lastUpdate && (
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {lastUpdate.toLocaleTimeString()} (refreshes every 10 seconds)
                  </Typography>
                )}
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ReloadOutlined />}
                  onClick={refreshLiveData}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadOutlined />}
                  onClick={handleExportReport}
                >
                  Export Report
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlined />}
                  onClick={handleRemovePortfolio}
                >
                  Remove Portfolio
                </Button>
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

        {/* Risk Metrics */}
        <Grid item xs={12}>
          <RiskMetrics riskMetrics={riskMetrics} preferences={preferences} />
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12} lg={8}>
          <PortfolioPerformance portfolio={currentPortfolio} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <SectorAllocation riskMetrics={riskMetrics} />
        </Grid>

        {/* Portfolio Table */}
        <Grid item xs={12}>
          <PortfolioTable portfolio={currentPortfolio} riskMetrics={riskMetrics} />
        </Grid>

        {/* Upload New Portfolio */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Want to analyze a different portfolio? Upload a new file below.
          </Alert>
          <PortfolioUpload onUploadComplete={handleUploadComplete} />
        </Grid>
      </Grid>
    </Box>
  );
}