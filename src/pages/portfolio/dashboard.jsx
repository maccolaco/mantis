import { useState, useEffect } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

// project imports
import { usePortfolio } from 'contexts/PortfolioContext';
import PortfolioUpload from 'components/portfolio/PortfolioUpload';
import PortfolioTable from 'components/portfolio/PortfolioTable';
import RiskMetrics from 'components/portfolio/RiskMetrics';
import SectorAllocation from 'components/portfolio/SectorAllocation';
import PortfolioPerformance from 'components/portfolio/PortfolioPerformance';
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

  // Auto-refresh live data
  useEffect(() => {
    let interval;
    
    if (currentPortfolio?.holdings?.length) {
      // Initial load
      refreshLiveData();
      
      // Set up interval
      interval = setInterval(() => {
        refreshLiveData();
      }, preferences.refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentPortfolio, preferences.refreshInterval]);

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
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography variant="h4" gutterBottom>
            Portfolio Risk Management
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Upload your portfolio to start analyzing risk metrics and performance.
          </Typography>
        </Grid>
        <Grid xs={12} md={8} lg={6}>
          <PortfolioUpload onUploadComplete={handleUploadComplete} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom>
              {currentPortfolio.name}
            </Typography>
            {lastUpdate && (
              <Typography variant="caption" color="text.secondary">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ReloadOutlined />}
              onClick={refreshLiveData}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={handleExportReport}
            >
              Export Report
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlined />}
              onClick={handleRemovePortfolio}
            >
              Remove Portfolio
            </Button>
          </Stack>
        </Stack>
      </Grid>

      {/* Risk Metrics */}
      <Grid xs={12}>
        <RiskMetrics riskMetrics={riskMetrics} preferences={preferences} />
      </Grid>

      {/* Charts Row */}
      <Grid xs={12} lg={8}>
        <PortfolioPerformance portfolio={currentPortfolio} />
      </Grid>
      <Grid xs={12} lg={4}>
        <SectorAllocation riskMetrics={riskMetrics} />
      </Grid>

      {/* Portfolio Table */}
      <Grid xs={12}>
        <PortfolioTable portfolio={currentPortfolio} riskMetrics={riskMetrics} />
      </Grid>

      {/* Upload New Portfolio */}
      <Grid xs={12}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Want to analyze a different portfolio? Upload a new file below.
        </Alert>
        <PortfolioUpload onUploadComplete={handleUploadComplete} />
      </Grid>
    </Grid>
  );
}