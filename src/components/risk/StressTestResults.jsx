import PropTypes from 'prop-types';

// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import MainCard from 'components/MainCard';

export default function StressTestResults({ results }) {
  if (!results) {
    return (
      <MainCard title="Stress Test Results">
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          Run stress tests to see potential portfolio impacts under adverse scenarios.
        </Typography>
      </MainCard>
    );
  }

  const getSeverityColor = (lossPercent) => {
    if (lossPercent > 0.3) return 'error';
    if (lossPercent > 0.15) return 'warning';
    return 'success';
  };

  const getSeverityLabel = (lossPercent) => {
    if (lossPercent > 0.3) return 'Severe';
    if (lossPercent > 0.15) return 'Moderate';
    return 'Mild';
  };

  return (
    <MainCard title="Stress Test Results">
      <List>
        {Object.entries(results).map(([scenarioName, result]) => (
          <ListItem key={scenarioName} divider>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">
                    {scenarioName}
                  </Typography>
                  <Chip
                    label={getSeverityLabel(Math.abs(result.lossPercent))}
                    color={getSeverityColor(Math.abs(result.lossPercent))}
                    size="small"
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Potential Loss:
                    </Typography>
                    <Typography variant="body2" color="error.main" fontWeight="bold">
                      <NumericFormat
                        value={Math.abs(result.loss)}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={0}
                      />
                      {' '}
                      ({(Math.abs(result.lossPercent) * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(Math.abs(result.lossPercent) * 100, 100)}
                    color={getSeverityColor(Math.abs(result.lossPercent))}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Original Value:
                    </Typography>
                    <Typography variant="caption">
                      <NumericFormat
                        value={result.originalValue}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={0}
                      />
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      Stressed Value:
                    </Typography>
                    <Typography variant="caption">
                      <NumericFormat
                        value={result.stressedValue}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={0}
                      />
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', px: 2 }}>
        Stress tests simulate extreme market conditions to assess portfolio resilience.
      </Typography>
    </MainCard>
  );
}

StressTestResults.propTypes = {
  results: PropTypes.object
};