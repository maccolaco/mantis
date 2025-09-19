import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project imports
import MainCard from 'components/MainCard';

export default function CorrelationHeatmap({ correlationMatrix, holdings }) {
  const theme = useTheme();

  if (!correlationMatrix || !holdings || holdings.length === 0) {
    return (
      <MainCard title="Correlation Matrix">
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No correlation data available
        </Typography>
      </MainCard>
    );
  }

  const getCorrelationColor = (correlation) => {
    const intensity = Math.abs(correlation);
    if (correlation > 0) {
      // Positive correlation - red scale
      return `rgba(244, 67, 54, ${intensity})`;
    } else {
      // Negative correlation - blue scale
      return `rgba(33, 150, 243, ${intensity})`;
    }
  };

  const symbols = holdings.map(h => h.symbol);

  return (
    <MainCard title="Asset Correlation Matrix">
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 400, p: 2 }}>
          <Grid container spacing={0}>
            {/* Header row */}
            <Grid item xs={2}>
              <Box sx={{ height: 40 }} />
            </Grid>
            {symbols.map((symbol, index) => (
              <Grid item key={symbol} xs={2}>
                <Box
                  sx={{
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotate(-45deg)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  {symbol}
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Data rows */}
          {symbols.map((rowSymbol, rowIndex) => (
            <Grid container spacing={0} key={rowSymbol}>
              {/* Row header */}
              <Grid item xs={2}>
                <Box
                  sx={{
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    pr: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  {rowSymbol}
                </Box>
              </Grid>

              {/* Correlation cells */}
              {symbols.map((colSymbol, colIndex) => {
                const correlation = correlationMatrix[rowIndex]?.[colIndex] || 0;
                return (
                  <Grid item key={colSymbol} xs={2}>
                    <Box
                      sx={{
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: getCorrelationColor(correlation),
                        border: '1px solid',
                        borderColor: 'divider',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: Math.abs(correlation) > 0.5 ? 'white' : 'text.primary'
                      }}
                    >
                      {correlation.toFixed(2)}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Correlation:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: 'rgba(33, 150, 243, 1)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          />
          <Typography variant="caption">-1.0 (Negative)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: 'rgba(128, 128, 128, 0.3)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          />
          <Typography variant="caption">0.0 (No correlation)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: 'rgba(244, 67, 54, 1)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          />
          <Typography variant="caption">+1.0 (Positive)</Typography>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Higher correlations indicate assets that tend to move together. Diversification benefits from low correlations.
      </Typography>
    </MainCard>
  );
}

CorrelationHeatmap.propTypes = {
  correlationMatrix: PropTypes.array,
  holdings: PropTypes.array
};