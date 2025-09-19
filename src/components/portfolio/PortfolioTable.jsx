import { useMemo } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import MainCard from 'components/MainCard';

// assets
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

function PnLCell({ value, percent }) {
  const isPositive = value >= 0;
  const color = isPositive ? 'success' : 'error';
  const Icon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Icon style={{ fontSize: '0.875rem', color: isPositive ? 'green' : 'red' }} />
      <Box>
        <NumericFormat
          value={Math.abs(value)}
          displayType="text"
          thousandSeparator
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
        />
        <Typography variant="caption" color={`${color}.main`} sx={{ ml: 1 }}>
          ({percent >= 0 ? '+' : ''}{(percent * 100).toFixed(2)}%)
        </Typography>
      </Box>
    </Box>
  );
}

export default function PortfolioTable({ portfolio, riskMetrics }) {
  const holdings = useMemo(() => {
    if (!riskMetrics?.holdings) return portfolio?.holdings || [];
    return riskMetrics.holdings;
  }, [portfolio, riskMetrics]);

  if (!holdings.length) {
    return (
      <MainCard title="Portfolio Holdings">
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No holdings to display. Upload a portfolio to get started.
        </Typography>
      </MainCard>
    );
  }

  return (
    <MainCard title="Portfolio Holdings" content={false}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">Market Value</TableCell>
              <TableCell align="right">Current Value</TableCell>
              <TableCell align="right">P&L</TableCell>
              <TableCell align="right">Weight</TableCell>
              <TableCell>Sector</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holdings.map((holding) => {
              const currentPrice = holding.currentPrice || holding.price;
              const currentValue = holding.currentValue || holding.marketValue;
              const pnl = holding.pnl || 0;
              const pnlPercent = holding.pnlPercent || 0;
              const weight = (currentValue / (riskMetrics?.totalValue || portfolio?.totalValue || 1)) * 100;

              return (
                <TableRow key={holding.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {holding.symbol}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat
                      value={holding.quantity}
                      displayType="text"
                      thousandSeparator
                      decimalScale={0}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat
                      value={holding.price}
                      displayType="text"
                      thousandSeparator
                      prefix="$"
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat
                      value={currentPrice}
                      displayType="text"
                      thousandSeparator
                      prefix="$"
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat
                      value={holding.marketValue}
                      displayType="text"
                      thousandSeparator
                      prefix="$"
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat
                      value={currentValue}
                      displayType="text"
                      thousandSeparator
                      prefix="$"
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </TableCell>
                  <TableCell align="right">
                    <PnLCell value={pnl} percent={pnlPercent} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {weight.toFixed(2)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={holding.sector || 'Unknown'}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

PnLCell.propTypes = {
  value: PropTypes.number.isRequired,
  percent: PropTypes.number.isRequired
};

PortfolioTable.propTypes = {
  portfolio: PropTypes.object,
  riskMetrics: PropTypes.object
};