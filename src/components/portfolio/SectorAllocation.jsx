import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// project imports
import MainCard from 'components/MainCard';

const COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

export default function SectorAllocation({ riskMetrics }) {
  const theme = useTheme();

  if (!riskMetrics?.sectorAllocation) {
    return (
      <MainCard title="Sector Allocation">
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No sector data available
        </Typography>
      </MainCard>
    );
  }

  const data = Object.entries(riskMetrics.sectorAllocation).map(([sector, weight]) => ({
    name: sector,
    value: weight * 100,
    weight: weight
  }));

  const CustomTooltip = ({ active, payload }) => {
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
          <Typography variant="subtitle2">{data.payload.name}</Typography>
          <Typography variant="body2" color="primary">
            {data.value.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <MainCard title="Sector Allocation">
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </MainCard>
  );
}

SectorAllocation.propTypes = {
  riskMetrics: PropTypes.object
};