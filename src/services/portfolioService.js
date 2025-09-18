import Papa from 'papaparse';
import marketDataService from './marketDataService';

// Portfolio service for handling portfolio operations
class PortfolioService {
  // Parse CSV/Excel file
  parsePortfolioFile(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const portfolio = this.processPortfolioData(results.data);
            resolve(portfolio);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  // Process parsed portfolio data
  processPortfolioData(data) {
    const holdings = data.map((row, index) => {
      const symbol = row.Symbol || row.symbol || row.Ticker || row.ticker;
      const quantity = parseFloat(row.Quantity || row.quantity || row.Shares || row.shares || 0);
      const price = parseFloat(row.Price || row.price || row['Current Price'] || 0);
      
      if (!symbol) {
        throw new Error(`Missing symbol in row ${index + 1}`);
      }

      return {
        id: `${symbol}_${Date.now()}_${index}`,
        symbol: symbol.toUpperCase(),
        quantity,
        price,
        marketValue: quantity * price,
        weight: 0, // Will be calculated later
        sector: row.Sector || row.sector || 'Unknown',
        industry: row.Industry || row.industry || 'Unknown'
      };
    });

    // Calculate total market value and weights
    const totalMarketValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
    holdings.forEach(holding => {
      holding.weight = totalMarketValue > 0 ? holding.marketValue / totalMarketValue : 0;
    });

    return {
      id: `portfolio_${Date.now()}`,
      name: `Portfolio ${new Date().toLocaleDateString()}`,
      holdings,
      totalValue: totalMarketValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Calculate portfolio risk metrics
  calculateRiskMetrics(portfolio, liveData = {}) {
    if (!portfolio || !portfolio.holdings.length) {
      return null;
    }

    const holdings = portfolio.holdings.map(holding => {
      const livePrice = liveData[holding.symbol]?.price || holding.price;
      const currentValue = holding.quantity * livePrice;
      const pnl = currentValue - holding.marketValue;
      const pnlPercent = holding.marketValue > 0 ? pnl / holding.marketValue : 0;

      return {
        ...holding,
        currentPrice: livePrice,
        currentValue,
        pnl,
        pnlPercent
      };
    });

    const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalPnL = holdings.reduce((sum, h) => sum + h.pnl, 0);
    const totalPnLPercent = portfolio.totalValue > 0 ? totalPnL / portfolio.totalValue : 0;

    // Calculate concentration risk (largest position weight)
    const maxWeight = Math.max(...holdings.map(h => h.currentValue / totalCurrentValue));

    // Calculate sector allocation
    const sectorAllocation = {};
    holdings.forEach(holding => {
      const sector = holding.sector || 'Unknown';
      const weight = holding.currentValue / totalCurrentValue;
      sectorAllocation[sector] = (sectorAllocation[sector] || 0) + weight;
    });

    // Simple volatility calculation (would need historical data for accurate calculation)
    const returns = holdings.map(h => h.pnlPercent);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    return {
      totalValue: totalCurrentValue,
      totalPnL,
      totalPnLPercent,
      maxConcentration: maxWeight,
      volatility,
      sectorAllocation,
      numberOfHoldings: holdings.length,
      updatedAt: new Date().toISOString(),
      holdings
    };
  }

  // Update portfolio with live data
  async updatePortfolioWithLiveData(portfolio) {
    if (!portfolio || !portfolio.holdings.length) {
      return portfolio;
    }

    const symbols = portfolio.holdings.map(h => h.symbol);
    const liveData = await marketDataService.getPrices(symbols);

    const updatedHoldings = portfolio.holdings.map(holding => {
      const livePrice = liveData[holding.symbol]?.price || holding.price;
      const currentValue = holding.quantity * livePrice;
      
      return {
        ...holding,
        currentPrice: livePrice,
        currentValue,
        pnl: currentValue - holding.marketValue,
        pnlPercent: holding.marketValue > 0 ? (currentValue - holding.marketValue) / holding.marketValue : 0
      };
    });

    return {
      ...portfolio,
      holdings: updatedHoldings,
      updatedAt: new Date().toISOString()
    };
  }

  // Generate sample portfolio for demo
  generateSamplePortfolio() {
    const sampleHoldings = [
      { symbol: 'AAPL', quantity: 100, price: 238.99, sector: 'Technology' },
      { symbol: 'GOOGL', quantity: 50, price: 142.30, sector: 'Technology' },
      { symbol: 'MSFT', quantity: 75, price: 510.02, sector: 'Technology' },
      { symbol: 'AMZN', quantity: 25, price: 155.20, sector: 'Consumer Discretionary' },
      { symbol: 'TSLA', quantity: 30, price: 248.50, sector: 'Consumer Discretionary' },
      { symbol: 'JPM', quantity: 40, price: 168.75, sector: 'Financials' },
      { symbol: 'JNJ', quantity: 60, price: 156.25, sector: 'Healthcare' },
      { symbol: 'PG', quantity: 35, price: 155.80, sector: 'Consumer Staples' }
    ];

    const holdings = sampleHoldings.map((holding, index) => ({
      id: `${holding.symbol}_${Date.now()}_${index}`,
      symbol: holding.symbol,
      quantity: holding.quantity,
      price: holding.price,
      marketValue: holding.quantity * holding.price,
      weight: 0,
      sector: holding.sector,
      industry: 'Sample Industry'
    }));

    const totalMarketValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
    holdings.forEach(holding => {
      holding.weight = holding.marketValue / totalMarketValue;
    });

    return {
      id: `sample_portfolio_${Date.now()}`,
      name: 'Sample Portfolio',
      holdings,
      totalValue: totalMarketValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export default new PortfolioService();