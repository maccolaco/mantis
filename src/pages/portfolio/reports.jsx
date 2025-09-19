import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

// project imports
import MainCard from 'components/MainCard';
import ReportGenerator from 'components/reports/ReportGenerator';
import { usePortfolio } from 'contexts/PortfolioContext';

// assets
import { 
  FileTextOutlined, 
  DownloadOutlined, 
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';

export default function PortfolioReports() {
  const { currentPortfolio } = usePortfolio();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const reportTemplates = [
    {
      id: 'comprehensive',
      title: 'Comprehensive Risk Report',
      description: 'Complete portfolio analysis including risk metrics, stress tests, and recommendations',
      icon: <FileTextOutlined />,
      features: ['Risk Metrics', 'Stress Testing', 'Sector Analysis', 'Recommendations'],
      format: 'PDF',
      estimatedPages: '15-20 pages'
    },
    {
      id: 'executive',
      title: 'Executive Summary',
      description: 'High-level overview for stakeholders and decision makers',
      icon: <BarChartOutlined />,
      features: ['Key Metrics', 'Performance Summary', 'Risk Alerts', 'Action Items'],
      format: 'PDF',
      estimatedPages: '3-5 pages'
    },
    {
      id: 'detailed',
      title: 'Detailed Holdings Report',
      description: 'In-depth analysis of individual positions and allocations',
      icon: <PieChartOutlined />,
      features: ['Position Details', 'Sector Breakdown', 'Correlation Analysis', 'Concentration Risk'],
      format: 'Excel/CSV',
      estimatedPages: 'Data Export'
    },
    {
      id: 'performance',
      title: 'Performance Attribution',
      description: 'Historical performance analysis and attribution by sector/asset',
      icon: <LineChartOutlined />,
      features: ['Returns Analysis', 'Benchmark Comparison', 'Attribution', 'Drawdown Analysis'],
      format: 'PDF',
      estimatedPages: '8-12 pages'
    }
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Daily Risk Summary',
      frequency: 'Daily',
      lastGenerated: '2024-01-15',
      nextScheduled: '2024-01-16',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Weekly Portfolio Review',
      frequency: 'Weekly',
      lastGenerated: '2024-01-14',
      nextScheduled: '2024-01-21',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Monthly Risk Assessment',
      frequency: 'Monthly',
      lastGenerated: '2024-01-01',
      nextScheduled: '2024-02-01',
      status: 'Paused'
    }
  ];

  if (!currentPortfolio) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h4" gutterBottom>
                  Portfolio Reports
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Upload a portfolio to generate comprehensive risk reports and analytics.
                </Typography>
                <Button
                  variant="contained"
                  href="/portfolio/dashboard"
                  size="large"
                >
                  Upload Portfolio
                </Button>
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <MainCard>
            <Typography variant="h4" gutterBottom>
              Portfolio Reports
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate professional reports for {currentPortfolio.name}
            </Typography>
          </MainCard>
        </Grid>

        {/* Report Templates */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Report Templates
          </Typography>
          <Grid container spacing={3}>
            {reportTemplates.map((template) => (
              <Grid item xs={12} md={6} key={template.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ color: 'primary.main', fontSize: '2rem' }}>
                        {template.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {template.title}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip label={template.format} size="small" color="primary" />
                          <Chip label={template.estimatedPages} size="small" variant="outlined" />
                        </Stack>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {template.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Includes:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {template.features.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      variant="contained"
                      startIcon={<DownloadOutlined />}
                      onClick={() => setReportDialogOpen(true)}
                      fullWidth
                    >
                      Generate Report
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Scheduled Reports */}
        <Grid item xs={12}>
          <MainCard title="Scheduled Reports">
            <Grid container spacing={2}>
              {scheduledReports.map((report) => (
                <Grid item xs={12} md={4} key={report.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {report.name}
                      </Typography>
                      
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Frequency:
                          </Typography>
                          <Typography variant="body2">
                            {report.frequency}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Last Generated:
                          </Typography>
                          <Typography variant="body2">
                            {report.lastGenerated}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Next Scheduled:
                          </Typography>
                          <Typography variant="body2">
                            {report.nextScheduled}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Status:
                          </Typography>
                          <Chip
                            label={report.status}
                            size="small"
                            color={report.status === 'Active' ? 'success' : 'warning'}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                    
                    <CardActions>
                      <Button size="small" startIcon={<CalendarOutlined />}>
                        Configure
                      </Button>
                      <Button size="small" startIcon={<DownloadOutlined />}>
                        Generate Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </MainCard>
        </Grid>

        {/* Recent Reports */}
        <Grid item xs={12}>
          <MainCard title="Recent Reports">
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              No reports generated yet. Create your first report using the templates above.
            </Typography>
          </MainCard>
        </Grid>
      </Grid>

      {/* Report Generator Dialog */}
      <ReportGenerator
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      />
    </Box>
  );
}