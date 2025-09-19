import PropTypes from 'prop-types';

// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// project imports
import MainCard from 'components/MainCard';

// assets
import { 
  ExpandMoreOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ErrorOutlined,
  InfoOutlined,
  BulbOutlined
} from '@ant-design/icons';

export default function RiskInsights({ insights }) {
  if (!insights) {
    return (
      <MainCard title="Risk Insights & Recommendations">
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No insights available. Risk analysis will generate actionable recommendations.
        </Typography>
      </MainCard>
    );
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined style={{ color: 'green' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: 'orange' }} />;
      case 'error':
        return <ErrorOutlined style={{ color: 'red' }} />;
      default:
        return <InfoOutlined style={{ color: 'blue' }} />;
    }
  };

  const getInsightSeverity = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const allInsights = [
    ...(insights.riskInsights || []),
    ...(insights.concentrationInsights || []),
    ...(insights.performanceInsights || []),
    ...(insights.sectorInsights || []),
    ...(insights.rebalancingInsights || []),
    ...(insights.benchmarkInsights || [])
  ];

  const groupedInsights = allInsights.reduce((acc, insight) => {
    const category = insight.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(insight);
    return acc;
  }, {});

  const categoryLabels = {
    risk: 'Risk Analysis',
    concentration: 'Concentration Risk',
    performance: 'Performance Analysis',
    allocation: 'Asset Allocation',
    rebalancing: 'Rebalancing Advice',
    benchmark: 'Benchmark Comparison',
    general: 'General Insights'
  };

  return (
    <MainCard title="Risk Insights & Recommendations">
      {allInsights.length === 0 ? (
        <Alert severity="info" icon={<InfoOutlined />}>
          <Typography variant="subtitle2">
            Portfolio Analysis Complete
          </Typography>
          <Typography variant="body2">
            Your portfolio appears to be well-balanced with no major risk concerns at this time.
          </Typography>
        </Alert>
      ) : (
        <Box>
          {Object.entries(groupedInsights).map(([category, categoryInsights]) => (
            <Accordion key={category} defaultExpanded={category === 'risk'}>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6">
                    {categoryLabels[category] || category}
                  </Typography>
                  <Chip 
                    label={categoryInsights.length} 
                    size="small" 
                    color="primary"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {categoryInsights.map((insight, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemIcon>
                        {getInsightIcon(insight.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle2">
                              {insight.title}
                            </Typography>
                            <Chip
                              label={insight.priority}
                              size="small"
                              color={getPriorityColor(insight.priority)}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {insight.message}
                            </Typography>
                            
                            {insight.suggestions && insight.suggestions.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                  <BulbOutlined style={{ fontSize: '0.875rem' }} />
                                  Recommendations:
                                </Typography>
                                <List dense sx={{ pl: 2 }}>
                                  {insight.suggestions.map((suggestion, suggestionIndex) => (
                                    <ListItem key={suggestionIndex} sx={{ py: 0, px: 0 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        • {suggestion}
                                      </Typography>
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </MainCard>
  );
}

RiskInsights.propTypes = {
  insights: PropTypes.object
};