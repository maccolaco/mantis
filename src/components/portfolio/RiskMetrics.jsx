import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

export default function RiskMetrics({ riskMetrics, preferences }) {
  if (!riskMetrics) {
    return (
      <Alert severity="info">
        Upload a portfolio to view risk metrics
      </Alert>
    );
  }

  const {
    totalValue,
    totalPnL,
    totalPnLPercent,
    maxConcentration,
    volatility,
    numberOfHoldings
  } = riskMetrics;

  // Risk threshold checks
  const concentrationRisk = maxConcentration > (preferences?.riskThresholds?.concentration || 0.3);
  const volatilityRisk = volatility > (preferences?.riskThresholds?.volatility || 0.25);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <AnalyticEcommerce
          title="Total Portfolio Value"
          count={
            <NumericFormat
              value={totalValue}
              displayType="text"
              thousandSeparator
              prefix="$"
              decimalScale={0}
            />
          }
          color="primary"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <AnalyticEcommerce
          title="Total P&L"
          count={
            <NumericFormat
              value={Math.abs(totalPnL)}
              displayType="text"
              thousandSeparator
              prefix={totalPnL >= 0 ? '+$' : '-$'}
              decimalScale={0}
            />
          }
          percentage={Math.abs(totalPnLPercent * 100)}
          isLoss={totalPnL < 0}
          color={totalPnL >= 0 ? 'success' : 'error'}
          extra={`${(totalPnLPercent * 100).toFixed(2)}%`}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <AnalyticEcommerce
          title="Max Concentration"
          count={`${(maxConcentration * 100).toFixed(1)}%`}
          color={concentrationRisk ? 'warning' : 'success'}
          extra={concentrationRisk ? 'High Risk' : 'Normal'}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <AnalyticEcommerce
          title="Portfolio Volatility"
          count={`${(volatility * 100).toFixed(1)}%`}
          color={volatilityRisk ? 'warning' : 'success'}
          extra={`${numberOfHoldings} holdings`}
        />
      </Grid>

      {(concentrationRisk || volatilityRisk) && (
        <Grid size={12}>
          <Alert severity="warning">
            <Typography variant="subtitle2" gutterBottom>
              Risk Alerts:
            </Typography>
            {concentrationRisk && (
              <Typography variant="body2">
                • High concentration risk: Largest position exceeds {(preferences?.riskThresholds?.concentration || 0.3) * 100}% threshold
              </Typography>
            )}
            {volatilityRisk && (
              <Typography variant="body2">
                • High volatility: Portfolio volatility exceeds {(preferences?.riskThresholds?.volatility || 0.25) * 100}% threshold
              </Typography>
            )}
          </Alert>
        </Grid>
      )}
    </Grid>
  );
}

RiskMetrics.propTypes = {
  riskMetrics: PropTypes.object,
  preferences: PropTypes.object
};