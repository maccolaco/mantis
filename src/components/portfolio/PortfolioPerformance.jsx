import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// third-party
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// project imports
import MainCard from 'components/MainCard';
import marketDataService from 'services/marketDataService';

export default function PortfolioPerformance({ portfolio }) {
  const theme = useTheme();
  const [performanceData, setPerformanceData] = useState([]);
  const [timeRange, setTimeRange] = useState('1m');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (portfolio?.holdings?.length) {
      loadPerformanceData();
    }
  }, [portfolio, timeRange]);

  const loadPerformanceData = async () => {
    if (!portfolio?.holdings?.length) return;

    setLoading(true);
    try {
      // For demo purposes, we'll use the first holding's historical data
      // In a real app, you'd calculate portfolio-level performance
      const mainHolding = portfolio.holdings[0];
      const historicalData = await marketDataService.getHistoricalData(mainHolding.symbol, timeRange);
      
      // Calculate cumulative returns
      const basePrice = historicalData[0]?.close || 100;
      const data = historicalData.map((item, index) => ({
        date: item.date,
        value: ((item.close - basePrice) / basePrice) * 100,
        price: item.close
      }));

      setPerformanceData(data);
    } catch (error) {
      console.error('Error loading performance data:', error);
      // Generate mock data for demo
      generateMockPerformanceData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockPerformanceData = () => {
    const data = [];
    let value = 0;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      value += (Math.random() - 0.5) * 2; // Random walk
      data.push({
        date: date.toISOString().split('T')[0],
        value: value,
        price: 100 + value
      });
    }
    
    setPerformanceData(data);
  };

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
          <Typography variant="body2" color={data.value >= 0 ? 'success.main' : 'error.main'}>
            {data.value >= 0 ? '+' : ''}{data.value.toFixed(2)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const timeRanges = [
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1Y' }
  ];

  return (
    <MainCard 
      title="Portfolio Performance" 
      secondary={
        <Stack direction="row" spacing={1}>
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              size="small"
              variant={timeRange === range.value ? 'contained' : 'outlined'}
              onClick={() => setTimeRange(range.value)}
              disabled={loading}
            >
              {range.label}
            </Button>
          ))}
        </Stack>
      }
    >
      {!portfolio?.holdings?.length ? (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No portfolio data available
        </Typography>
      ) : (
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="date" 
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <YAxis 
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: theme.palette.primary.main }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </MainCard>
  );
}

PortfolioPerformance.propTypes = {
  portfolio: PropTypes.object
};