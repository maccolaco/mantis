import { useState, useEffect } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import MainCard from 'components/MainCard';
import useRiskStore from 'stores/riskStore';
import { usePortfolio } from 'contexts/PortfolioContext';
import VaRChart from './VaRChart';
import CorrelationHeatmap from './CorrelationHeatmap';
import DrawdownChart from './DrawdownChart';
import StressTestResults from './StressTestResults';
import RiskInsights from './RiskInsights';

// assets
import { 
  CalculatorOutlined, 
  ExperimentOutlined, 
  AlertOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

export default function RiskDashboard() {
  const { currentPortfolio, liveData } = usePortfolio();
  const {
    riskMetrics,
    stressTestResults,
    insights,
    alerts,
    correlationMatrix,
    isCalculating,
    lastCalculation,
    calculateRiskMetrics,
    runStressTests,
    runScenarioAnalysis,
    requestNotificationPermission
  } = useRiskStore();

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (currentPortfolio) {
      calculateRiskMetrics(currentPortfolio, liveData);
      requestNotificationPermission();
    }
  }, [currentPortfolio, liveData, calculateRiskMetrics, requestNotificationPermission]);

  useEffect(() => {
    if (!autoRefresh || !currentPortfolio) return;

    const interval = setInterval(() => {
      calculateRiskMetrics(currentPortfolio, liveData);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, currentPortfolio, liveData, calculateRiskMetrics]);

  const handleRunStressTests = () => {
    if (currentPortfolio) {
      runStressTests(currentPortfolio);
    }
  };

  const handleRunScenarios = () => {
    if (currentPortfolio) {
      runScenarioAnalysis(currentPortfolio);
    }
  };

  const handleRefresh = () => {
    if (currentPortfolio) {
      calculateRiskMetrics(currentPortfolio, liveData);
    }
  };

  if (!currentPortfolio) {
    return (
      <MainCard>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No portfolio loaded. Please upload a portfolio to view risk analytics.
          </Typography>
        </Box>
      </MainCard>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <MainCard>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" gutterBottom>
                  Risk Analytics Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lastCalculation && `Last updated: ${new Date(lastCalculation).toLocaleString()}`}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRefresh}
                  disabled={isCalculating}
                  startIcon={isCalculating ? <CircularProgress size={16} /> : <CalculatorOutlined />}
                >
                  {isCalculating ? 'Calculating...' : 'Refresh'}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRunStressTests}
                  disabled={isCalculating}
                  startIcon={<ExperimentOutlined />}
                >
                  Stress Tests
                </Button>
                <Button
                  variant={autoRefresh ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  Auto Refresh
                </Button>
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Grid item xs={12}>
            <Alert 
              severity="warning" 
              icon={<AlertOutlined />}
              action={
                <Button size="small" onClick={() => useRiskStore.getState().clearAllAlerts()}>
                  Clear All
                </Button>
              }
            >
              <Typography variant="subtitle2" gutterBottom>
                Risk Alerts ({alerts.length})
              </Typography>
              {alerts.slice(0, 3).map((alert, index) => (
                <Typography key={index} variant="body2">
                  • {alert.message}
                </Typography>
              ))}
              {alerts.length > 3 && (
                <Typography variant="body2" color="text.secondary">
                  ... and {alerts.length - 3} more alerts
                </Typography>
              )}
            </Alert>
          </Grid>
        )}

        {/* Key Risk Metrics */}
        {riskMetrics && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" color="text.secondary">
                      Value at Risk (95%)
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      <NumericFormat
                        value={Math.abs(riskMetrics.var95 || 0) * 100}
                        displayType="text"
                        decimalScale={2}
                        suffix="%"
                      />
                    </Typography>
                    <Chip 
                      label="Daily VaR" 
                      size="small" 
                      color={Math.abs(riskMetrics.var95 || 0) > 0.05 ? 'error' : 'success'}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" color="text.secondary">
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h4" color="primary.main">
                      {(riskMetrics.sharpeRatio || 0).toFixed(2)}
                    </Typography>
                    <Chip 
                      label="Risk-Adjusted Return" 
                      size="small" 
                      color={riskMetrics.sharpeRatio > 1 ? 'success' : 'warning'}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" color="text.secondary">
                      Maximum Drawdown
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      <NumericFormat
                        value={(riskMetrics.maxDrawdown?.maxDrawdown || 0) * 100}
                        displayType="text"
                        decimalScale={2}
                        suffix="%"
                      />
                    </Typography>
                    <Chip 
                      label="Peak to Trough" 
                      size="small" 
                      color={riskMetrics.maxDrawdown?.maxDrawdown > 0.2 ? 'error' : 'warning'}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" color="text.secondary">
                      Portfolio Beta
                    </Typography>
                    <Typography variant="h4" color="info.main">
                      {(riskMetrics.beta || 0).toFixed(2)}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {riskMetrics.beta > 1 ? (
                        <ArrowUpOutlined style={{ color: 'orange' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: 'green' }} />
                      )}
                      <Chip 
                        label={riskMetrics.beta > 1 ? 'High Beta' : 'Low Beta'} 
                        size="small" 
                        color={riskMetrics.beta > 1.2 ? 'warning' : 'success'}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Charts Row */}
        <Grid item xs={12} lg={6}>
          <VaRChart riskMetrics={riskMetrics} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DrawdownChart riskMetrics={riskMetrics} />
        </Grid>

        {/* Correlation Heatmap */}
        <Grid item xs={12}>
          <CorrelationHeatmap 
            correlationMatrix={correlationMatrix} 
            holdings={currentPortfolio.holdings}
          />
        </Grid>

        {/* Risk Insights */}
        <Grid item xs={12} lg={8}>
          <RiskInsights insights={insights} />
        </Grid>

        {/* Stress Test Results */}
        <Grid item xs={12} lg={4}>
          <StressTestResults results={stressTestResults} />
        </Grid>
      </Grid>
    </Box>
  );
}