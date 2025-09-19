// Advanced Risk Analytics Engine
import { Matrix } from 'ml-matrix';

class RiskAnalyticsEngine {
  constructor() {
    this.cache = new Map();
    this.historicalData = new Map();
  }

  // Value at Risk Calculations
  calculateVaR(returns, confidence = 0.05, method = 'parametric') {
    switch (method) {
      case 'parametric':
        return this.parametricVaR(returns, confidence);
      case 'historical':
        return this.historicalVaR(returns, confidence);
      case 'monteCarlo':
        return this.monteCarloVaR(returns, confidence);
      default:
        return this.parametricVaR(returns, confidence);
    }
  }

  parametricVaR(returns, confidence) {
    const mean = this.mean(returns);
    const std = this.standardDeviation(returns);
    const zScore = this.inverseNormal(confidence);
    return mean + (zScore * std);
  }

  historicalVaR(returns, confidence) {
    const sorted = [...returns].sort((a, b) => a - b);
    const index = Math.floor(confidence * sorted.length);
    return sorted[index];
  }

  monteCarloVaR(returns, confidence, simulations = 10000) {
    const mean = this.mean(returns);
    const std = this.standardDeviation(returns);
    const simulatedReturns = [];

    for (let i = 0; i < simulations; i++) {
      const randomReturn = this.normalRandom(mean, std);
      simulatedReturns.push(randomReturn);
    }

    return this.historicalVaR(simulatedReturns, confidence);
  }

  // Conditional Value at Risk (Expected Shortfall)
  calculateCVaR(returns, confidence = 0.05) {
    const var95 = this.historicalVaR(returns, confidence);
    const tailReturns = returns.filter(r => r <= var95);
    return this.mean(tailReturns);
  }

  // Performance Ratios
  calculateSharpeRatio(returns, riskFreeRate = 0.02) {
    const excessReturns = returns.map(r => r - riskFreeRate / 252); // Daily risk-free rate
    const meanExcess = this.mean(excessReturns);
    const stdExcess = this.standardDeviation(excessReturns);
    return stdExcess === 0 ? 0 : meanExcess / stdExcess * Math.sqrt(252);
  }

  calculateSortinoRatio(returns, riskFreeRate = 0.02, targetReturn = 0) {
    const excessReturns = returns.map(r => r - riskFreeRate / 252);
    const meanExcess = this.mean(excessReturns);
    const downside = returns.filter(r => r < targetReturn);
    const downsideDeviation = downside.length > 0 ? this.standardDeviation(downside) : 0;
    return downsideDeviation === 0 ? 0 : meanExcess / downsideDeviation * Math.sqrt(252);
  }

  calculateBeta(assetReturns, marketReturns) {
    if (assetReturns.length !== marketReturns.length) {
      throw new Error('Asset and market returns must have same length');
    }

    const covariance = this.covariance(assetReturns, marketReturns);
    const marketVariance = this.variance(marketReturns);
    return marketVariance === 0 ? 0 : covariance / marketVariance;
  }

  // Correlation Matrix
  calculateCorrelationMatrix(returnsMatrix) {
    const n = returnsMatrix.length;
    const correlationMatrix = Array(n).fill().map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          correlationMatrix[i][j] = 1;
        } else {
          correlationMatrix[i][j] = this.correlation(returnsMatrix[i], returnsMatrix[j]);
        }
      }
    }

    return correlationMatrix;
  }

  // Maximum Drawdown
  calculateMaxDrawdown(prices) {
    let maxDrawdown = 0;
    let peak = prices[0];
    let peakIndex = 0;
    let troughIndex = 0;
    let maxDrawdownStart = 0;
    let maxDrawdownEnd = 0;

    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > peak) {
        peak = prices[i];
        peakIndex = i;
      }

      const drawdown = (peak - prices[i]) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        troughIndex = i;
        maxDrawdownStart = peakIndex;
        maxDrawdownEnd = i;
      }
    }

    return {
      maxDrawdown,
      start: maxDrawdownStart,
      end: maxDrawdownEnd,
      duration: maxDrawdownEnd - maxDrawdownStart,
      recovery: this.calculateRecoveryTime(prices, maxDrawdownEnd, peak)
    };
  }

  calculateRecoveryTime(prices, troughIndex, peakValue) {
    for (let i = troughIndex + 1; i < prices.length; i++) {
      if (prices[i] >= peakValue) {
        return i - troughIndex;
      }
    }
    return null; // Not recovered yet
  }

  // Stress Testing
  performStressTest(portfolio, scenarios) {
    const results = {};

    scenarios.forEach(scenario => {
      const stressedPortfolio = this.applyStressScenario(portfolio, scenario);
      results[scenario.name] = {
        originalValue: portfolio.totalValue,
        stressedValue: stressedPortfolio.totalValue,
        loss: portfolio.totalValue - stressedPortfolio.totalValue,
        lossPercent: (portfolio.totalValue - stressedPortfolio.totalValue) / portfolio.totalValue,
        holdings: stressedPortfolio.holdings
      };
    });

    return results;
  }

  applyStressScenario(portfolio, scenario) {
    const stressedHoldings = portfolio.holdings.map(holding => {
      let stressedPrice = holding.currentPrice || holding.price;
      
      // Apply sector-specific shocks
      if (scenario.sectorShocks && scenario.sectorShocks[holding.sector]) {
        stressedPrice *= (1 + scenario.sectorShocks[holding.sector]);
      }

      // Apply market-wide shock
      if (scenario.marketShock) {
        stressedPrice *= (1 + scenario.marketShock);
      }

      // Apply volatility shock
      if (scenario.volatilityShock) {
        const randomShock = this.normalRandom(0, scenario.volatilityShock);
        stressedPrice *= (1 + randomShock);
      }

      const stressedValue = holding.quantity * stressedPrice;
      
      return {
        ...holding,
        stressedPrice,
        stressedValue,
        stressImpact: stressedValue - (holding.currentValue || holding.marketValue)
      };
    });

    const totalStressedValue = stressedHoldings.reduce((sum, h) => sum + h.stressedValue, 0);

    return {
      ...portfolio,
      holdings: stressedHoldings,
      totalValue: totalStressedValue
    };
  }

  // Scenario Analysis
  runScenarioAnalysis(portfolio, scenarios) {
    const results = {};

    scenarios.forEach(scenario => {
      const scenarioResult = this.applyScenario(portfolio, scenario);
      results[scenario.name] = scenarioResult;
    });

    return results;
  }

  applyScenario(portfolio, scenario) {
    // Apply custom scenario logic based on scenario type
    switch (scenario.type) {
      case 'interestRate':
        return this.applyInterestRateScenario(portfolio, scenario);
      case 'inflation':
        return this.applyInflationScenario(portfolio, scenario);
      case 'recession':
        return this.applyRecessionScenario(portfolio, scenario);
      default:
        return this.applyCustomScenario(portfolio, scenario);
    }
  }

  applyInterestRateScenario(portfolio, scenario) {
    const rateDelta = scenario.rateDelta; // e.g., +0.02 for 200bp increase
    
    const adjustedHoldings = portfolio.holdings.map(holding => {
      let priceImpact = 0;
      
      // Different sectors react differently to rate changes
      switch (holding.sector) {
        case 'Financials':
          priceImpact = rateDelta * 0.5; // Banks benefit from higher rates
          break;
        case 'Real Estate':
          priceImpact = rateDelta * -1.2; // REITs hurt by higher rates
          break;
        case 'Utilities':
          priceImpact = rateDelta * -0.8; // Utilities hurt by higher rates
          break;
        case 'Technology':
          priceImpact = rateDelta * -0.6; // Growth stocks hurt by higher rates
          break;
        default:
          priceImpact = rateDelta * -0.3; // General market impact
      }

      const adjustedPrice = (holding.currentPrice || holding.price) * (1 + priceImpact);
      const adjustedValue = holding.quantity * adjustedPrice;

      return {
        ...holding,
        scenarioPrice: adjustedPrice,
        scenarioValue: adjustedValue,
        scenarioImpact: adjustedValue - (holding.currentValue || holding.marketValue)
      };
    });

    return {
      ...portfolio,
      holdings: adjustedHoldings,
      totalValue: adjustedHoldings.reduce((sum, h) => sum + h.scenarioValue, 0),
      scenario: scenario.name
    };
  }

  applyInflationScenario(portfolio, scenario) {
    const inflationRate = scenario.inflationRate;
    
    const adjustedHoldings = portfolio.holdings.map(holding => {
      let priceImpact = 0;
      
      // Inflation impact by sector
      switch (holding.sector) {
        case 'Energy':
          priceImpact = inflationRate * 0.8; // Energy benefits from inflation
          break;
        case 'Materials':
          priceImpact = inflationRate * 0.6; // Materials benefit
          break;
        case 'Consumer Staples':
          priceImpact = inflationRate * 0.3; // Some pricing power
          break;
        case 'Technology':
          priceImpact = inflationRate * -0.4; // Growth stocks hurt
          break;
        default:
          priceImpact = inflationRate * -0.2; // General negative impact
      }

      const adjustedPrice = (holding.currentPrice || holding.price) * (1 + priceImpact);
      const adjustedValue = holding.quantity * adjustedPrice;

      return {
        ...holding,
        scenarioPrice: adjustedPrice,
        scenarioValue: adjustedValue,
        scenarioImpact: adjustedValue - (holding.currentValue || holding.marketValue)
      };
    });

    return {
      ...portfolio,
      holdings: adjustedHoldings,
      totalValue: adjustedHoldings.reduce((sum, h) => sum + h.scenarioValue, 0),
      scenario: scenario.name
    };
  }

  applyRecessionScenario(portfolio, scenario) {
    const severity = scenario.severity || 0.3; // 30% market decline
    
    const adjustedHoldings = portfolio.holdings.map(holding => {
      let sectorMultiplier = 1;
      
      // Recession impact by sector
      switch (holding.sector) {
        case 'Consumer Discretionary':
          sectorMultiplier = 1.5; // Hit hardest
          break;
        case 'Financials':
          sectorMultiplier = 1.3;
          break;
        case 'Technology':
          sectorMultiplier = 1.2;
          break;
        case 'Consumer Staples':
          sectorMultiplier = 0.6; // Defensive
          break;
        case 'Healthcare':
          sectorMultiplier = 0.7; // Defensive
          break;
        case 'Utilities':
          sectorMultiplier = 0.5; // Most defensive
          break;
        default:
          sectorMultiplier = 1.0;
      }

      const priceImpact = -severity * sectorMultiplier;
      const adjustedPrice = (holding.currentPrice || holding.price) * (1 + priceImpact);
      const adjustedValue = holding.quantity * adjustedPrice;

      return {
        ...holding,
        scenarioPrice: adjustedPrice,
        scenarioValue: adjustedValue,
        scenarioImpact: adjustedValue - (holding.currentValue || holding.marketValue)
      };
    });

    return {
      ...portfolio,
      holdings: adjustedHoldings,
      totalValue: adjustedHoldings.reduce((sum, h) => sum + h.scenarioValue, 0),
      scenario: scenario.name
    };
  }

  applyCustomScenario(portfolio, scenario) {
    // Apply custom shocks defined in scenario
    const adjustedHoldings = portfolio.holdings.map(holding => {
      let adjustedPrice = holding.currentPrice || holding.price;

      // Apply symbol-specific shocks
      if (scenario.symbolShocks && scenario.symbolShocks[holding.symbol]) {
        adjustedPrice *= (1 + scenario.symbolShocks[holding.symbol]);
      }

      // Apply sector-specific shocks
      if (scenario.sectorShocks && scenario.sectorShocks[holding.sector]) {
        adjustedPrice *= (1 + scenario.sectorShocks[holding.sector]);
      }

      const adjustedValue = holding.quantity * adjustedPrice;

      return {
        ...holding,
        scenarioPrice: adjustedPrice,
        scenarioValue: adjustedValue,
        scenarioImpact: adjustedValue - (holding.currentValue || holding.marketValue)
      };
    });

    return {
      ...portfolio,
      holdings: adjustedHoldings,
      totalValue: adjustedHoldings.reduce((sum, h) => sum + h.scenarioValue, 0),
      scenario: scenario.name
    };
  }

  // Greeks Calculation (simplified for equity portfolios)
  calculateDelta(portfolio, marketChange = 0.01) {
    // Simplified delta as price sensitivity to market moves
    const totalValue = portfolio.totalValue;
    const marketBeta = this.calculatePortfolioBeta(portfolio);
    return totalValue * marketBeta * marketChange;
  }

  calculatePortfolioBeta(portfolio) {
    // Simplified beta calculation using sector betas
    const sectorBetas = {
      'Technology': 1.3,
      'Healthcare': 0.9,
      'Financials': 1.2,
      'Consumer Discretionary': 1.1,
      'Consumer Staples': 0.7,
      'Energy': 1.4,
      'Materials': 1.2,
      'Industrials': 1.1,
      'Utilities': 0.6,
      'Real Estate': 0.8
    };

    let weightedBeta = 0;
    const totalValue = portfolio.totalValue;

    portfolio.holdings.forEach(holding => {
      const weight = (holding.currentValue || holding.marketValue) / totalValue;
      const beta = sectorBetas[holding.sector] || 1.0;
      weightedBeta += weight * beta;
    });

    return weightedBeta;
  }

  // Utility functions
  mean(array) {
    return array.reduce((sum, val) => sum + val, 0) / array.length;
  }

  variance(array) {
    const mean = this.mean(array);
    return array.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (array.length - 1);
  }

  standardDeviation(array) {
    return Math.sqrt(this.variance(array));
  }

  covariance(array1, array2) {
    const mean1 = this.mean(array1);
    const mean2 = this.mean(array2);
    let sum = 0;
    
    for (let i = 0; i < array1.length; i++) {
      sum += (array1[i] - mean1) * (array2[i] - mean2);
    }
    
    return sum / (array1.length - 1);
  }

  correlation(array1, array2) {
    const cov = this.covariance(array1, array2);
    const std1 = this.standardDeviation(array1);
    const std2 = this.standardDeviation(array2);
    return (std1 === 0 || std2 === 0) ? 0 : cov / (std1 * std2);
  }

  normalRandom(mean = 0, std = 1) {
    // Box-Muller transformation
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return z * std + mean;
  }

  inverseNormal(p) {
    // Approximation of inverse normal distribution
    // For more accuracy, use a proper statistical library
    if (p <= 0 || p >= 1) {
      throw new Error('Probability must be between 0 and 1');
    }
    
    // Beasley-Springer-Moro algorithm approximation
    const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

    const pLow = 0.02425;
    const pHigh = 1 - pLow;
    let q, r;

    if (p < pLow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) / ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    } else if (p <= pHigh) {
      q = p - 0.5;
      r = q * q;
      return (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q / (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) / ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    }
  }

  // Generate mock historical returns for testing
  generateMockReturns(symbol, days = 252) {
    const returns = [];
    const volatility = this.getSymbolVolatility(symbol);
    
    for (let i = 0; i < days; i++) {
      returns.push(this.normalRandom(0, volatility));
    }
    
    return returns;
  }

  getSymbolVolatility(symbol) {
    const volatilities = {
      'AAPL': 0.25,
      'GOOGL': 0.28,
      'MSFT': 0.22,
      'AMZN': 0.32,
      'TSLA': 0.45,
      'JPM': 0.28,
      'JNJ': 0.18,
      'PG': 0.16
    };
    
    return volatilities[symbol] || 0.25;
  }
}

export default new RiskAnalyticsEngine();