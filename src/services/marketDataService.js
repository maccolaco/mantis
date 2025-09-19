import axios from 'axios';

// Market data service for fetching live prices
class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10000; // 10 seconds cache
    
    // Alpha Vantage API (free tier: 25 requests per day, 5 per minute)
    this.apiKey = 'demo'; // Users should replace with their own API key
    this.baseUrl = 'https://www.alphavantage.co/query';
    
    // Fallback to Finnhub (free tier: 60 calls/minute)
    this.finnhubApiKey = 'demo'; // Users should replace with their own API key
    this.finnhubBaseUrl = 'https://finnhub.io/api/v1';
    
    // Base prices for fallback mock data
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

  // Get live price for a single symbol using Alpha Vantage
  async getPrice(symbol) {
    const cacheKey = `price_${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Try Alpha Vantage first
      const priceData = await this.fetchFromAlphaVantage(symbol);
      this.cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
      return priceData;
    } catch (error) {
      console.warn(`Failed to fetch real price for ${symbol}, using fallback:`, error.message);
      
      try {
        // Try Finnhub as fallback
        const priceData = await this.fetchFromFinnhub(symbol);
        this.cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
        return priceData;
      } catch (fallbackError) {
        console.warn(`Finnhub also failed for ${symbol}, using mock data:`, fallbackError.message);
        // Use mock data as final fallback
        const priceData = this.getMockPrice(symbol);
        this.cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
        return priceData;
      }
    }
  }

  // Fetch from Alpha Vantage API
  async fetchFromAlphaVantage(symbol) {
    const url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
    
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;
    
    if (data['Error Message']) {
      throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
    }
    
    if (data['Note']) {
      throw new Error('Alpha Vantage API rate limit exceeded');
    }
    
    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
      throw new Error('Invalid response format from Alpha Vantage');
    }
    
    const currentPrice = parseFloat(quote['05. price']);
    const previousClose = parseFloat(quote['08. previous close']);
    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? change / previousClose : 0;
    
    return {
      symbol,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(4)),
      volume: parseInt(quote['06. volume']) || 0,
      timestamp: Date.now(),
      source: 'Alpha Vantage'
    };
  }

  // Fetch from Finnhub API
  async fetchFromFinnhub(symbol) {
    const url = `${this.finnhubBaseUrl}/quote?symbol=${symbol}&token=${this.finnhubApiKey}`;
    
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;
    
    if (data.error) {
      throw new Error(`Finnhub API error: ${data.error}`);
    }
    
    if (!data.c || data.c === 0) {
      throw new Error('Invalid or missing price data from Finnhub');
    }
    
    const currentPrice = data.c; // Current price
    const previousClose = data.pc; // Previous close
    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? change / previousClose : 0;
    
    return {
      symbol,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(4)),
      volume: 0, // Finnhub doesn't provide volume in quote endpoint
      timestamp: Date.now(),
      source: 'Finnhub'
    };
  }

  // Get live prices for multiple symbols
  async getPrices(symbols) {
    const prices = {};
    const promises = symbols.map(async (symbol) => {
      try {
        const price = await this.getPrice(symbol);
        prices[symbol] = price;
      } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
        // Use mock data as fallback
        prices[symbol] = this.getMockPrice(symbol);
      }
    });
    
    await Promise.all(promises);
    return prices;
  }

  // Get historical data for a symbol
  async getHistoricalData(symbol, range = '1m') {
    try {
      // For demo purposes, we'll use mock data for historical data
      // In production, you'd want to implement real historical data fetching
      return this.getMockHistoricalData(symbol);
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return this.getMockHistoricalData(symbol);
    }
  }

  // Mock data for demo purposes (fallback)
  getMockPrice(symbol) {
    const basePrice = this.basePrices[symbol] || (100 + Math.random() * 400);
    
    // Generate realistic price movement (±2% from base price)
    const priceVariation = (Math.random() - 0.5) * 0.04; // ±2%
    const currentPrice = basePrice * (1 + priceVariation);
    const change = currentPrice - basePrice;
    const changePercent = change / basePrice;
    
    return {
      symbol,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(4)),
      volume: Math.floor(Math.random() * 1000000),
      timestamp: Date.now(),
      source: 'Mock Data'
    };
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

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Set API keys
  setApiKeys(alphaVantageKey, finnhubKey) {
    if (alphaVantageKey) this.apiKey = alphaVantageKey;
    if (finnhubKey) this.finnhubApiKey = finnhubKey;
  }
}

export default new MarketDataService();