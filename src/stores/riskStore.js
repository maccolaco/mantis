// Zustand store for risk management state
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import riskAnalyticsEngine from '../services/riskAnalyticsEngine';
import advisoryEngine from '../services/advisoryEngine';

const useRiskStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    riskMetrics: null,
    stressTestResults: null,
    scenarioResults: null,
    insights: null,
    alerts: [],
    correlationMatrix: null,
    historicalData: {},
    isCalculating: false,
    lastCalculation: null,
    
    // Stress test scenarios
    predefinedScenarios: [
      {
        name: 'Market Crash (-30%)',
        type: 'market',
        marketShock: -0.30,
        description: '30% market-wide decline'
      },
      {
        name: 'Interest Rate Shock (+200bp)',
        type: 'interestRate',
        rateDelta: 0.02,
        description: '200 basis point rate increase'
      },
      {
        name: 'Tech Sector Crash (-40%)',
        type: 'sector',
        sectorShocks: { 'Technology': -0.40 },
        description: '40% decline in technology sector'
      },
      {
        name: 'Inflation Spike (5%)',
        type: 'inflation',
        inflationRate: 0.05,
        description: '5% inflation scenario'
      },
      {
        name: 'Recession Scenario',
        type: 'recession',
        severity: 0.25,
        description: 'Economic recession with 25% market decline'
      },
      {
        name: 'Volatility Spike',
        type: 'volatility',
        volatilityShock: 0.5,
        description: '50% increase in market volatility'
      }
    ],

    // Actions
    calculateRiskMetrics: async (portfolio, liveData = {}) => {
      if (!portfolio || !portfolio.holdings.length) return;

      set({ isCalculating: true });

      try {
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

        // Calculate sector allocation
        const sectorAllocation = {};
        holdings.forEach(holding => {
          const sector = holding.sector || 'Unknown';
          const weight = holding.currentValue / totalCurrentValue;
          sectorAllocation[sector] = (sectorAllocation[sector] || 0) + weight;
        });

        // Generate mock returns for risk calculations
        const portfolioReturns = [];
        for (let i = 0; i < 252; i++) { // 1 year of daily returns
          let portfolioReturn = 0;
          holdings.forEach(holding => {
            const weight = holding.currentValue / totalCurrentValue;
            const assetReturn = riskAnalyticsEngine.normalRandom(0, riskAnalyticsEngine.getSymbolVolatility(holding.symbol) / Math.sqrt(252));
            portfolioReturn += weight * assetReturn;
          });
          portfolioReturns.push(portfolioReturn);
        }

        // Calculate risk metrics
        const var95 = riskAnalyticsEngine.calculateVaR(portfolioReturns, 0.05, 'historical');
        const var99 = riskAnalyticsEngine.calculateVaR(portfolioReturns, 0.01, 'historical');
        const cvar95 = riskAnalyticsEngine.calculateCVaR(portfolioReturns, 0.05);
        const sharpeRatio = riskAnalyticsEngine.calculateSharpeRatio(portfolioReturns);
        const sortinoRatio = riskAnalyticsEngine.calculateSortinoRatio(portfolioReturns);
        const portfolioBeta = riskAnalyticsEngine.calculatePortfolioBeta(portfolio);
        
        // Generate price series for max drawdown calculation
        const priceSeries = [100]; // Start at 100
        portfolioReturns.forEach(ret => {
          priceSeries.push(priceSeries[priceSeries.length - 1] * (1 + ret));
        });
        const maxDrawdown = riskAnalyticsEngine.calculateMaxDrawdown(priceSeries);

        // Calculate concentration risk
        const maxConcentration = Math.max(...holdings.map(h => h.currentValue / totalCurrentValue));

        // Calculate correlation matrix
        const returnsMatrix = holdings.map(holding => 
          riskAnalyticsEngine.generateMockReturns(holding.symbol, 252)
        );
        const correlationMatrix = riskAnalyticsEngine.calculateCorrelationMatrix(returnsMatrix);

        const riskMetrics = {
          totalValue: totalCurrentValue,
          totalPnL,
          totalPnLPercent,
          var95,
          var99,
          cvar95,
          sharpeRatio,
          sortinoRatio,
          beta: portfolioBeta,
          maxDrawdown,
          maxConcentration,
          volatility: riskAnalyticsEngine.standardDeviation(portfolioReturns) * Math.sqrt(252),
          sectorAllocation,
          numberOfHoldings: holdings.length,
          updatedAt: new Date().toISOString(),
          holdings
        };

        // Generate insights
        const insights = advisoryEngine.generateInsights(portfolio, riskMetrics, liveData);

        set({ 
          riskMetrics, 
          insights,
          correlationMatrix,
          isCalculating: false,
          lastCalculation: new Date().toISOString()
        });

        // Check for alerts
        get().checkAlerts(riskMetrics);

      } catch (error) {
        console.error('Error calculating risk metrics:', error);
        set({ isCalculating: false });
      }
    },

    runStressTests: async (portfolio) => {
      if (!portfolio || !portfolio.holdings.length) return;

      set({ isCalculating: true });

      try {
        const scenarios = get().predefinedScenarios;
        const results = riskAnalyticsEngine.performStressTest(portfolio, scenarios);
        
        set({ 
          stressTestResults: results,
          isCalculating: false 
        });

      } catch (error) {
        console.error('Error running stress tests:', error);
        set({ isCalculating: false });
      }
    },

    runScenarioAnalysis: async (portfolio, customScenarios = []) => {
      if (!portfolio || !portfolio.holdings.length) return;

      set({ isCalculating: true });

      try {
        const allScenarios = [...get().predefinedScenarios, ...customScenarios];
        const results = riskAnalyticsEngine.runScenarioAnalysis(portfolio, allScenarios);
        
        set({ 
          scenarioResults: results,
          isCalculating: false 
        });

      } catch (error) {
        console.error('Error running scenario analysis:', error);
        set({ isCalculating: false });
      }
    },

    addCustomScenario: (scenario) => {
      const scenarios = get().predefinedScenarios;
      set({ 
        predefinedScenarios: [...scenarios, { ...scenario, id: Date.now() }]
      });
    },

    removeCustomScenario: (scenarioId) => {
      const scenarios = get().predefinedScenarios.filter(s => s.id !== scenarioId);
      set({ predefinedScenarios: scenarios });
    },

    checkAlerts: (riskMetrics) => {
      const newAlerts = advisoryEngine.generateAlerts({}, riskMetrics);
      const existingAlerts = get().alerts;
      
      // Add new alerts that don't already exist
      const uniqueNewAlerts = newAlerts.filter(newAlert => 
        !existingAlerts.some(existing => 
          existing.title === newAlert.title && 
          existing.category === newAlert.category
        )
      );

      if (uniqueNewAlerts.length > 0) {
        set({ alerts: [...existingAlerts, ...uniqueNewAlerts] });
        
        // Trigger desktop notifications if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          uniqueNewAlerts.forEach(alert => {
            if (alert.priority === 'high') {
              new Notification(alert.title, {
                body: alert.message,
                icon: '/favicon.svg'
              });
            }
          });
        }
      }
    },

    dismissAlert: (alertIndex) => {
      const alerts = get().alerts.filter((_, index) => index !== alertIndex);
      set({ alerts });
    },

    clearAllAlerts: () => {
      set({ alerts: [] });
    },

    requestNotificationPermission: () => {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    },

    // Historical data management
    updateHistoricalData: (symbol, data) => {
      const historicalData = get().historicalData;
      set({ 
        historicalData: { 
          ...historicalData, 
          [symbol]: data 
        }
      });
    },

    clearHistoricalData: () => {
      set({ historicalData: {} });
    }
  }))
);

export default useRiskStore;