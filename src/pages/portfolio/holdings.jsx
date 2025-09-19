import { useState, useMemo } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// project imports
import MainCard from 'components/MainCard';
import PortfolioTable from 'components/portfolio/PortfolioTable';
import ReportGenerator from 'components/reports/ReportGenerator';
import { usePortfolio } from 'contexts/PortfolioContext';
import useRiskStore from 'stores/riskStore';

// assets
import { SearchOutlined, FileTextOutlined, FilterOutlined } from '@ant-design/icons';

export default function PortfolioHoldings() {
  const { currentPortfolio } = usePortfolio();
  const { riskMetrics } = useRiskStore();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [sortBy, setSortBy] = useState('weight');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and sort holdings
  const filteredAndSortedHoldings = useMemo(() => {
    if (!currentPortfolio?.holdings) return [];

    let filtered = currentPortfolio.holdings.filter(holding => {
      const matchesSearch = holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (holding.sector || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = !sectorFilter || holding.sector === sectorFilter;
      return matchesSearch && matchesSector;
    });

    // Sort holdings
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'value':
          aValue = a.currentValue || a.marketValue;
          bValue = b.currentValue || b.marketValue;
          break;
        case 'weight':
          const totalValue = riskMetrics?.totalValue || currentPortfolio.totalValue || 1;
          aValue = (a.currentValue || a.marketValue) / totalValue;
          bValue = (b.currentValue || b.marketValue) / totalValue;
          break;
        case 'pnl':
          aValue = a.pnl || 0;
          bValue = b.pnl || 0;
          break;
        case 'sector':
          aValue = a.sector || '';
          bValue = b.sector || '';
          break;
        default:
          aValue = a.symbol;
          bValue = b.symbol;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [currentPortfolio, riskMetrics, searchTerm, sectorFilter, sortBy, sortOrder]);

  // Get unique sectors for filter
  const sectors = useMemo(() => {
    if (!currentPortfolio?.holdings) return [];
    const uniqueSectors = [...new Set(currentPortfolio.holdings.map(h => h.sector).filter(Boolean))];
    return uniqueSectors.sort();
  }, [currentPortfolio]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  if (!currentPortfolio) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h4" gutterBottom>
                  Portfolio Holdings
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Upload a portfolio to view detailed holdings analysis.
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

  // Create filtered portfolio for table
  const filteredPortfolio = {
    ...currentPortfolio,
    holdings: filteredAndSortedHoldings
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <MainCard>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" gutterBottom>
                  Portfolio Holdings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Detailed view of {currentPortfolio.name} ({currentPortfolio.holdings.length} positions)
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<FileTextOutlined />}
                onClick={() => setReportDialogOpen(true)}
              >
                Export Holdings
              </Button>
            </Stack>
          </MainCard>
        </Grid>

        {/* Filters and Search */}
        <Grid item xs={12}>
          <MainCard>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search by symbol or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Sector Filter</InputLabel>
                <Select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  label="Sector Filter"
                  startAdornment={<FilterOutlined style={{ marginRight: 8 }} />}
                >
                  <MenuItem value="">All Sectors</MenuItem>
                  {sectors.map((sector) => (
                    <MenuItem key={sector} value={sector}>
                      {sector}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="weight">Weight</MenuItem>
                  <MenuItem value="value">Value</MenuItem>
                  <MenuItem value="pnl">P&L</MenuItem>
                  <MenuItem value="symbol">Symbol</MenuItem>
                  <MenuItem value="sector">Sector</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </Button>
            </Stack>

            {/* Results Summary */}
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredAndSortedHoldings.length} of {currentPortfolio.holdings.length} holdings
                {sectorFilter && ` in ${sectorFilter} sector`}
                {searchTerm && ` matching "${searchTerm}"`}
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        {/* Holdings Table */}
        <Grid item xs={12}>
          <PortfolioTable 
            portfolio={filteredPortfolio} 
            riskMetrics={riskMetrics}
          />
        </Grid>

        {/* Holdings Summary Stats */}
        <Grid item xs={12}>
          <MainCard title="Holdings Summary">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {currentPortfolio.holdings.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Positions
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {sectors.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sectors
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {riskMetrics ? `${(riskMetrics.maxConcentration * 100).toFixed(1)}%` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Largest Position
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {currentPortfolio.holdings.filter(h => (h.pnl || 0) > 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Profitable Positions
                  </Typography>
                </Box>
              </Grid>
            </Grid>
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