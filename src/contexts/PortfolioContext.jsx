import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

// Initial state
const initialState = {
  portfolios: [],
  currentPortfolio: null,
  liveData: {},
  riskMetrics: null,
  loading: false,
  error: null,
  preferences: {
    refreshInterval: 30000, // 30 seconds
    riskThresholds: {
      maxDrawdown: 0.1,
      volatility: 0.25,
      concentration: 0.3
    }
  }
};

// Action types
const PORTFOLIO_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_PORTFOLIO: 'ADD_PORTFOLIO',
  UPDATE_PORTFOLIO: 'UPDATE_PORTFOLIO',
  DELETE_PORTFOLIO: 'DELETE_PORTFOLIO',
  SET_CURRENT_PORTFOLIO: 'SET_CURRENT_PORTFOLIO',
  UPDATE_LIVE_DATA: 'UPDATE_LIVE_DATA',
  UPDATE_RISK_METRICS: 'UPDATE_RISK_METRICS',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES'
};

// Reducer
function portfolioReducer(state, action) {
  switch (action.type) {
    case PORTFOLIO_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case PORTFOLIO_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case PORTFOLIO_ACTIONS.ADD_PORTFOLIO:
      return { 
        ...state, 
        portfolios: [...state.portfolios, action.payload],
        currentPortfolio: action.payload
      };
    case PORTFOLIO_ACTIONS.UPDATE_PORTFOLIO:
      return {
        ...state,
        portfolios: state.portfolios.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        currentPortfolio: state.currentPortfolio?.id === action.payload.id 
          ? action.payload 
          : state.currentPortfolio
      };
    case PORTFOLIO_ACTIONS.DELETE_PORTFOLIO:
      return {
        ...state,
        portfolios: state.portfolios.filter(p => p.id !== action.payload),
        currentPortfolio: state.currentPortfolio?.id === action.payload 
          ? null 
          : state.currentPortfolio
      };
    case PORTFOLIO_ACTIONS.SET_CURRENT_PORTFOLIO:
      return { ...state, currentPortfolio: action.payload };
    case PORTFOLIO_ACTIONS.UPDATE_LIVE_DATA:
      return { ...state, liveData: { ...state.liveData, ...action.payload } };
    case PORTFOLIO_ACTIONS.UPDATE_RISK_METRICS:
      return { ...state, riskMetrics: action.payload };
    case PORTFOLIO_ACTIONS.UPDATE_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    default:
      return state;
  }
}

// Context
const PortfolioContext = createContext();

// Provider
export function PortfolioProvider({ children }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        const { portfolios, preferences } = JSON.parse(savedData);
        if (portfolios) {
          portfolios.forEach(portfolio => {
            dispatch({ type: PORTFOLIO_ACTIONS.ADD_PORTFOLIO, payload: portfolio });
          });
        }
        if (preferences) {
          dispatch({ type: PORTFOLIO_ACTIONS.UPDATE_PREFERENCES, payload: preferences });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    const dataToSave = {
      portfolios: state.portfolios,
      preferences: state.preferences
    };
    localStorage.setItem('portfolioData', JSON.stringify(dataToSave));
  }, [state.portfolios, state.preferences]);

  const value = {
    ...state,
    dispatch,
    actions: PORTFOLIO_ACTIONS
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

// Hook
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

PortfolioProvider.propTypes = {
  children: PropTypes.node.isRequired
};