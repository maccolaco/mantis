// AI-Powered Advisory Engine
class AdvisoryEngine {
  constructor() {
    this.benchmarks = {
      'SP500': { expectedReturn: 0.10, volatility: 0.16 },
      'NASDAQ': { expectedReturn: 0.12, volatility: 0.20 },
      'MSCI_WORLD': { expectedReturn: 0.09, volatility: 0.15 }
    };
  }

  // Generate comprehensive portfolio insights
  generateInsights(portfolio, riskMetrics, marketData) {
    const insights = {
      riskInsights: this.analyzeRiskProfile(portfolio, riskMetrics),
      concentrationInsights: this.analyzeConcentration(portfolio, riskMetrics),
      performanceInsights: this.analyzePerformance(portfolio, riskMetrics),
      sectorInsights: this.analyzeSectorAllocation(portfolio, riskMetrics),
      rebalancingInsights: this.generateRebalancingAdvice(portfolio, riskMetrics),
      benchmarkInsights: this.compareToBenchmarks(portfolio, riskMetrics),
      alertInsights: this.generateAlerts(portfolio, riskMetrics)
    };

    return insights;
  }

  analyzeRiskProfile(portfolio, riskMetrics) {
    const insights = [];
    
    // VaR Analysis
    if (riskMetrics.var95) {
      const varPercent = Math.abs(riskMetrics.var95) * 100;
      if (varPercent > 5) {
        insights.push({
          type: 'warning',
          category: 'risk',
          title: 'High Value at Risk',
          message: `Your portfolio has a 95% VaR of ${varPercent.toFixed(2)}%, indicating high potential losses. Consider reducing position sizes or adding defensive assets.`,
          priority: 'high',
          actionable: true,
          suggestions: ['Reduce position sizes', 'Add defensive assets', 'Increase cash allocation']
        });
      } else if (varPercent < 2) {
        insights.push({
          type: 'info',
          category: 'risk',
          title: 'Conservative Risk Profile',
          message: `Your portfolio has a low VaR of ${varPercent.toFixed(2)}%, suggesting conservative positioning. Consider if this aligns with your return objectives.`,
          priority: 'medium',
          actionable: true,
          suggestions: ['Consider higher-return assets', 'Evaluate risk tolerance', 'Review return targets']
        });
      }
    }

    // Sharpe Ratio Analysis
    if (riskMetrics.sharpeRatio) {
      if (riskMetrics.sharpeRatio < 0.5) {
        insights.push({
          type: 'warning',
          category: 'performance',
          title: 'Low Risk-Adjusted Returns',
          message: `Your Sharpe ratio of ${riskMetrics.sharpeRatio.toFixed(2)} indicates poor risk-adjusted performance. Consider optimizing your asset allocation.`,
          priority: 'high',
          actionable: true,
          suggestions: ['Optimize asset allocation', 'Reduce low-performing assets', 'Consider index funds']
        });
      } else if (riskMetrics.sharpeRatio > 1.5) {
        insights.push({
          type: 'success',
          category: 'performance',
          title: 'Excellent Risk-Adjusted Returns',
          message: `Your Sharpe ratio of ${riskMetrics.sharpeRatio.toFixed(2)} indicates excellent risk-adjusted performance. Well done!`,
          priority: 'low',
          actionable: false
        });
      }
    }

    // Maximum Drawdown Analysis
    if (riskMetrics.maxDrawdown) {
      const drawdownPercent = riskMetrics.maxDrawdown.maxDrawdown * 100;
      if (drawdownPercent > 20) {
        insights.push({
          type: 'error',
          category: 'risk',
          title: 'High Maximum Drawdown',
          message: `Your portfolio experienced a maximum drawdown of ${drawdownPercent.toFixed(2)}%. This indicates high volatility and potential for large losses.`,
          priority: 'high',
          actionable: true,
          suggestions: ['Implement stop-loss strategies', 'Diversify across asset classes', 'Consider volatility targeting']
        });
      }
    }

    return insights;
  }

  analyzeConcentration(portfolio, riskMetrics) {
    const insights = [];
    const concentrationThreshold = 0.15; // 15%

    // Single position concentration
    if (riskMetrics.maxConcentration > concentrationThreshold) {
      const maxPosition = portfolio.holdings.reduce((max, holding) => 
        (holding.currentValue || holding.marketValue) > (max.currentValue || max.marketValue) ? holding : max
      );

      insights.push({
        type: 'warning',
        category: 'concentration',
        title: 'High Single Position Concentration',
        message: `${maxPosition.symbol} represents ${(riskMetrics.maxConcentration * 100).toFixed(1)}% of your portfolio. Consider reducing this position to limit concentration risk.`,
        priority: 'high',
        actionable: true,
        suggestions: [`Reduce ${maxPosition.symbol} position`, 'Diversify into other assets', 'Set position size limits']
      });
    }

    // Sector concentration
    if (riskMetrics.sectorAllocation) {
      Object.entries(riskMetrics.sectorAllocation).forEach(([sector, weight]) => {
        if (weight > 0.4) { // 40% threshold
          insights.push({
            type: 'warning',
            category: 'concentration',
            title: `High ${sector} Sector Concentration`,
            message: `Your ${sector} allocation of ${(weight * 100).toFixed(1)}% is quite high. Consider diversifying across other sectors.`,
            priority: 'medium',
            actionable: true,
            suggestions: [`Reduce ${sector} exposure`, 'Add positions in other sectors', 'Consider sector ETFs for diversification']
          });
        }
      });
    }

    return insights;
  }

  analyzePerformance(portfolio, riskMetrics) {
    const insights = [];

    // P&L Analysis
    if (riskMetrics.totalPnLPercent) {
      const pnlPercent = riskMetrics.totalPnLPercent * 100;
      
      if (pnlPercent < -10) {
        insights.push({
          type: 'error',
          category: 'performance',
          title: 'Significant Portfolio Losses',
          message: `Your portfolio is down ${Math.abs(pnlPercent).toFixed(2)}%. Consider reviewing your investment strategy and risk management approach.`,
          priority: 'high',
          actionable: true,
          suggestions: ['Review investment thesis', 'Consider stop-loss rules', 'Reassess risk tolerance']
        });
      } else if (pnlPercent > 20) {
        insights.push({
          type: 'success',
          category: 'performance',
          title: 'Strong Portfolio Performance',
          message: `Your portfolio is up ${pnlPercent.toFixed(2)}%. Consider taking some profits or rebalancing to maintain your target allocation.`,
          priority: 'medium',
          actionable: true,
          suggestions: ['Consider profit-taking', 'Rebalance to target weights', 'Review position sizes']
        });
      }
    }

    return insights;
  }

  analyzeSectorAllocation(portfolio, riskMetrics) {
    const insights = [];
    const idealSectorAllocation = {
      'Technology': 0.25,
      'Healthcare': 0.15,
      'Financials': 0.15,
      'Consumer Discretionary': 0.12,
      'Consumer Staples': 0.08,
      'Industrials': 0.10,
      'Energy': 0.05,
      'Materials': 0.05,
      'Utilities': 0.03,
      'Real Estate': 0.02
    };

    if (riskMetrics.sectorAllocation) {
      Object.entries(idealSectorAllocation).forEach(([sector, idealWeight]) => {
        const currentWeight = riskMetrics.sectorAllocation[sector] || 0;
        const deviation = Math.abs(currentWeight - idealWeight);

        if (deviation > 0.1) { // 10% deviation threshold
          const isOverweight = currentWeight > idealWeight;
          insights.push({
            type: isOverweight ? 'warning' : 'info',
            category: 'allocation',
            title: `${sector} Sector ${isOverweight ? 'Overweight' : 'Underweight'}`,
            message: `Your ${sector} allocation of ${(currentWeight * 100).toFixed(1)}% deviates significantly from the ideal ${(idealWeight * 100).toFixed(1)}%.`,
            priority: 'medium',
            actionable: true,
            suggestions: isOverweight 
              ? [`Reduce ${sector} positions`, `Consider taking profits in ${sector}`]
              : [`Increase ${sector} exposure`, `Consider ${sector} ETFs or individual stocks`]
          });
        }
      });
    }

    return insights;
  }

  generateRebalancingAdvice(portfolio, riskMetrics) {
    const insights = [];
    
    // Calculate optimal weights using simplified mean-variance optimization
    const optimalWeights = this.calculateOptimalWeights(portfolio, riskMetrics);
    
    if (optimalWeights) {
      const rebalancingNeeded = this.checkRebalancingNeeded(portfolio, optimalWeights);
      
      if (rebalancingNeeded.length > 0) {
        insights.push({
          type: 'info',
          category: 'rebalancing',
          title: 'Rebalancing Recommended',
          message: 'Your portfolio has drifted from optimal weights. Consider rebalancing to improve risk-adjusted returns.',
          priority: 'medium',
          actionable: true,
          suggestions: rebalancingNeeded,
          details: optimalWeights
        });
      }
    }

    return insights;
  }

  calculateOptimalWeights(portfolio, riskMetrics) {
    // Simplified optimization - in practice, use proper optimization libraries
    const holdings = portfolio.holdings;
    const n = holdings.length;
    
    if (n === 0) return null;

    // Equal weight as baseline, adjusted for risk
    const baseWeight = 1 / n;
    const weights = {};

    holdings.forEach(holding => {
      // Adjust weight based on Sharpe ratio proxy (simplified)
      const sectorRisk = this.getSectorRisk(holding.sector);
      const riskAdjustment = 1 / sectorRisk;
      weights[holding.symbol] = baseWeight * riskAdjustment;
    });

    // Normalize weights to sum to 1
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    Object.keys(weights).forEach(symbol => {
      weights[symbol] /= totalWeight;
    });

    return weights;
  }

  getSectorRisk(sector) {
    const sectorRisks = {
      'Technology': 1.3,
      'Healthcare': 0.9,
      'Financials': 1.2,
      'Consumer Discretionary': 1.1,
      'Consumer Staples': 0.7,
      'Energy': 1.4,
      'Materials': 1.2,
      'Industrials': 1.0,
      'Utilities': 0.6,
      'Real Estate': 0.8
    };
    
    return sectorRisks[sector] || 1.0;
  }

  checkRebalancingNeeded(portfolio, optimalWeights) {
    const suggestions = [];
    const totalValue = portfolio.totalValue;
    const threshold = 0.05; // 5% threshold

    portfolio.holdings.forEach(holding => {
      const currentWeight = (holding.currentValue || holding.marketValue) / totalValue;
      const optimalWeight = optimalWeights[holding.symbol] || 0;
      const deviation = currentWeight - optimalWeight;

      if (Math.abs(deviation) > threshold) {
        if (deviation > 0) {
          suggestions.push(`Reduce ${holding.symbol} by ${(deviation * 100).toFixed(1)}%`);
        } else {
          suggestions.push(`Increase ${holding.symbol} by ${(Math.abs(deviation) * 100).toFixed(1)}%`);
        }
      }
    });

    return suggestions;
  }

  compareToBenchmarks(portfolio, riskMetrics) {
    const insights = [];

    // Compare Sharpe ratio to benchmarks
    if (riskMetrics.sharpeRatio) {
      const sp500Sharpe = 0.8; // Approximate historical Sharpe ratio
      const comparison = riskMetrics.sharpeRatio - sp500Sharpe;

      if (comparison < -0.2) {
        insights.push({
          type: 'warning',
          category: 'benchmark',
          title: 'Underperforming S&P 500',
          message: `Your Sharpe ratio of ${riskMetrics.sharpeRatio.toFixed(2)} is significantly below the S&P 500's ${sp500Sharpe}. Consider index fund allocation.`,
          priority: 'high',
          actionable: true,
          suggestions: ['Consider S&P 500 index funds', 'Review stock selection process', 'Evaluate active vs passive strategy']
        });
      } else if (comparison > 0.2) {
        insights.push({
          type: 'success',
          category: 'benchmark',
          title: 'Outperforming S&P 500',
          message: `Your Sharpe ratio of ${riskMetrics.sharpeRatio.toFixed(2)} exceeds the S&P 500's ${sp500Sharpe}. Excellent risk-adjusted performance!`,
          priority: 'low',
          actionable: false
        });
      }
    }

    return insights;
  }

  generateAlerts(portfolio, riskMetrics) {
    const alerts = [];

    // VaR threshold alert
    if (riskMetrics.var95 && Math.abs(riskMetrics.var95) > 0.05) {
      alerts.push({
        type: 'error',
        category: 'alert',
        title: 'VaR Threshold Exceeded',
        message: 'Portfolio VaR exceeds 5% threshold',
        priority: 'high',
        timestamp: new Date().toISOString()
      });
    }

    // Concentration alert
    if (riskMetrics.maxConcentration > 0.2) {
      alerts.push({
        type: 'warning',
        category: 'alert',
        title: 'Concentration Risk Alert',
        message: 'Single position exceeds 20% of portfolio',
        priority: 'medium',
        timestamp: new Date().toISOString()
      });
    }

    // Drawdown alert
    if (riskMetrics.maxDrawdown && riskMetrics.maxDrawdown.maxDrawdown > 0.15) {
      alerts.push({
        type: 'error',
        category: 'alert',
        title: 'High Drawdown Alert',
        message: 'Portfolio drawdown exceeds 15%',
        priority: 'high',
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  // Generate predictive insights using simple models
  generatePredictiveInsights(portfolio, historicalData) {
    const insights = [];

    // Volatility forecasting using EWMA
    const forecastedVol = this.forecastVolatility(historicalData);
    if (forecastedVol > 0.3) {
      insights.push({
        type: 'warning',
        category: 'forecast',
        title: 'High Volatility Forecast',
        message: `Forecasted volatility of ${(forecastedVol * 100).toFixed(1)}% suggests increased risk ahead. Consider defensive positioning.`,
        priority: 'medium',
        actionable: true,
        suggestions: ['Increase cash allocation', 'Add defensive assets', 'Consider volatility hedging']
      });
    }

    return insights;
  }

  forecastVolatility(returns, lambda = 0.94) {
    if (!returns || returns.length < 10) return 0.2; // Default volatility

    // Exponentially Weighted Moving Average (EWMA) volatility forecast
    let variance = 0;
    const recentReturns = returns.slice(-30); // Use last 30 observations
    
    for (let i = recentReturns.length - 1; i >= 0; i--) {
      const weight = Math.pow(lambda, recentReturns.length - 1 - i) * (1 - lambda);
      variance += weight * Math.pow(recentReturns[i], 2);
    }

    return Math.sqrt(variance * 252); // Annualized volatility
  }
}

export default new AdvisoryEngine();