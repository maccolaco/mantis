import axios from 'axios';

// Market data service for fetching live prices
class MarketDataService {
  constructor() {
    this.baseURL = 'https://api.iex.cloud/v1';
    this.token = import.meta.env.VITE_REACT_APP_IEX_TOKEN || 'pk_test_token'; // Use test token for demo
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  // Get live price for a single symbol
  async getPrice(symbol) {
    try {
      const cacheKey = `price_${symbol}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const response = await axios.get(
        `${this.baseURL}/data/core/quote/${symbol}`,
        {
          params: { token: this.token }
        }
      );

      const priceData = {
        symbol,
        price: response.data.latestPrice,
        change: response.data.change,
        changePercent: response.data.changePercent,
        volume: response.data.volume,
        marketCap: response.data.marketCap,
        timestamp: Date.now()
      };

      this.cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
      return priceData;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      // Return mock data for demo purposes
      return this.getMockPrice(symbol);
    }
  }

  // Get live prices for multiple symbols
  async getPrices(symbols) {
    try {
      const symbolsString = symbols.join(',');
      const response = await axios.get(
        `${this.baseURL}/data/core/quote`,
        {
          params: { 
            symbols: symbolsString,
            token: this.token 
          }
        }
      );

      const pricesData = {};
      Object.entries(response.data).forEach(([symbol, data]) => {
        pricesData[symbol] = {
          symbol,
          price: data.latestPrice,
          change: data.change,
          changePercent: data.changePercent,
          volume: data.volume,
          marketCap: data.marketCap,
          timestamp: Date.now()
        };
      });

      return pricesData;
    } catch (error) {
      console.error('Error fetching multiple prices:', error);
      // Return mock data for demo purposes
      return this.getMockPrices(symbols);
    }
  }

  // Get historical data for a symbol
  async getHistoricalData(symbol, range = '1m') {
    try {
      const response = await axios.get(
        `${this.baseURL}/data/core/historical-prices/${symbol}`,
        {
          params: { 
            range,
            token: this.token 
          }
        }
      );

      return response.data.map(item => ({
        date: item.date,
        close: item.close,
        volume: item.volume,
        high: item.high,
        low: item.low,
        open: item.open
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return this.getMockHistoricalData(symbol);
    }
  }

  // Mock data for demo purposes
  getMockPrice(symbol) {
    const basePrice = 100 + Math.random() * 400;
    const change = (Math.random() - 0.5) * 10;
    return {
      symbol,
      price: basePrice,
      change,
      changePercent: change / basePrice,
      volume: Math.floor(Math.random() * 1000000),
      marketCap: Math.floor(Math.random() * 100000000000),
      timestamp: Date.now()
    };
  }

  getMockPrices(symbols) {
    const prices = {};
    symbols.forEach(symbol => {
      prices[symbol] = this.getMockPrice(symbol);
    });
    return prices;
  }

  getMockHistoricalData(symbol) {
    const data = [];
    const basePrice = 100 + Math.random() * 400;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const price = basePrice + (Math.random() - 0.5) * 20;
      data.push({
        date: date.toISOString().split('T')[0],
        close: price,
        open: price + (Math.random() - 0.5) * 5,
        high: price + Math.random() * 10,
        low: price - Math.random() * 10,
        volume: Math.floor(Math.random() * 1000000)
      });
    }
    
    return data;
  }
}

export default new MarketDataService();