import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// project imports
import MainCard from 'components/MainCard';

export default function VaRChart({ riskMetrics }) {
  const theme = useTheme();

  if (!riskMetrics) {
    return (
      <MainCard title="Value at Risk Distribution">
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No risk data available
        </Typography>
      </MainCard>
    );
  }

  // Generate VaR data for different confidence levels
  const varData = [
    {
      confidence: '90%',
      var: Math.abs(riskMetrics.var95 || 0) * 0.8 * 100,
      label: '90% VaR'
    },
    {
      confidence: '95%',
      var: Math.abs(riskMetrics.var95 || 0) * 100,
      label: '95% VaR'
    },
    {
      confidence: '99%',
      var: Math.abs(riskMetrics.var99 || riskMetrics.var95 * 1.5 || 0) * 100,
      label: '99% VaR'
    },
    {
      confidence: 'CVaR',
      var: Math.abs(riskMetrics.cvar95 || riskMetrics.var95 * 1.3 || 0) * 100,
      label: 'Expected Shortfall'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
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
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2" color="error.main">
            {data.value.toFixed(2)}% potential loss
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <MainCard title="Value at Risk Analysis">
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={varData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="confidence" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="var" 
              fill={theme.palette.error.main}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Value at Risk represents the potential loss at different confidence levels over a 1-day period.
      </Typography>
    </MainCard>
  );
}

VaRChart.propTypes = {
  riskMetrics: PropTypes.object
};