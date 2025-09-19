import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// project imports
import MainCard from 'components/MainCard';

export default function DrawdownChart({ riskMetrics }) {
  const theme = useTheme();

  if (!riskMetrics?.maxDrawdown) {
    return (
      <MainCard title="Drawdown Analysis">
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No drawdown data available
        </Typography>
      </MainCard>
    );
  }

  // Generate mock drawdown series for visualization
  const generateDrawdownSeries = () => {
    const data = [];
    let currentValue = 100;
    let peak = 100;
    
    for (let i = 0; i < 252; i++) { // 1 year of daily data
      // Simulate price movement
      const dailyReturn = (Math.random() - 0.5) * 0.04; // ±2% daily
      currentValue *= (1 + dailyReturn);
      
      // Update peak
      if (currentValue > peak) {
        peak = currentValue;
      }
      
      // Calculate drawdown
      const drawdown = (peak - currentValue) / peak * 100;
      
      data.push({
        day: i + 1,
        value: currentValue,
        drawdown: -drawdown, // Negative for chart display
        peak: peak
      });
    }
    
    return data;
  };

  const drawdownData = generateDrawdownSeries();
  const maxDrawdownPercent = riskMetrics.maxDrawdown.maxDrawdown * 100;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: theme.customShadows.z1
          }}
        >
          <Typography variant="subtitle2">Day {label}</Typography>
          <Typography variant="body2" color="primary.main">
            Portfolio Value: ${data.value.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="error.main">
            Drawdown: {Math.abs(data.drawdown).toFixed(2)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <MainCard title="Drawdown Analysis">
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={drawdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="day" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={-maxDrawdownPercent} 
              stroke={theme.palette.error.main} 
              strokeDasharray="5 5"
              label={{ value: `Max DD: ${maxDrawdownPercent.toFixed(2)}%`, position: 'right' }}
            />
            <Line
              type="monotone"
              dataKey="drawdown"
              stroke={theme.palette.error.main}
              strokeWidth={2}
              dot={false}
              fill={theme.palette.error.light}
              fillOpacity={0.3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Maximum Drawdown
          </Typography>
          <Typography variant="h6" color="error.main">
            {maxDrawdownPercent.toFixed(2)}%
          </Typography>
        </Box>
        {riskMetrics.maxDrawdown.duration && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="h6">
              {riskMetrics.maxDrawdown.duration} days
            </Typography>
          </Box>
        )}
        {riskMetrics.maxDrawdown.recovery && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Recovery Time
            </Typography>
            <Typography variant="h6">
              {riskMetrics.maxDrawdown.recovery} days
            </Typography>
          </Box>
        )}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Drawdown measures the decline from peak to trough. Lower drawdowns indicate better risk management.
      </Typography>
    </MainCard>
  );
}

DrawdownChart.propTypes = {
  riskMetrics: PropTypes.object
};