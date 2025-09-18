import axios from 'axios';

// Market data service for fetching live prices
class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
    
    // Base prices for consistent mock data
    this.basePrices = {
      'AAPL': 238.99,
      'GOOGL': 142.30,
      'MSFT': 510.02,
      'AMZN': 155.20,
      'TSLA': 248.50,
      'JPM': 168.75,
      'JNJ': 156.25,
      'PG': 155.80
    };
  }

  // Get live price for a single symbol
  async getPrice(symbol) {
    const cacheKey = `price_${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // Use mock data for demo
    const priceData = this.getMockPrice(symbol);
    this.cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
    return priceData;
  }

  // Get live prices for multiple symbols
  async getPrices(symbols) {
    // Use mock data for demo
    return this.getMockPrices(symbols);
  }

  // Get historical data for a symbol
  async getHistoricalData(symbol, range = '1m') {
    // Use mock data for demo
    return this.getMockHistoricalData(symbol);
  }

  // Mock data for demo purposes
  getMockPrice(symbol) {
    const basePrice = this.basePrices[symbol] || (100 + Math.random() * 400);
    
    // Generate realistic price movement (±2% from base price for more accuracy)
    const priceVariation = (Math.random() - 0.5) * 0.04; // ±2%
    const currentPrice = basePrice * (1 + priceVariation);
    const change = currentPrice - basePrice;
    const changePercent = change / basePrice;
    
    return {
      symbol,
      price: Number(currentPrice.toFixed(2)),
      change,
      changePercent,
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
    const basePrice = this.basePrices[symbol] || (100 + Math.random() * 400);
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate more realistic price movement
      const dailyVariation = (Math.random() - 0.5) * 0.05; // ±2.5% daily
      const price = basePrice * (1 + dailyVariation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        close: Number(price.toFixed(2)),
        open: Number((price + (Math.random() - 0.5) * price * 0.02).toFixed(2)),
        high: Number((price + Math.random() * price * 0.03).toFixed(2)),
        low: Number((price - Math.random() * price * 0.03).toFixed(2)),
        volume: Math.floor(Math.random() * 1000000)
      });
    }
    
    return data;
  }
}

export default new MarketDataService();