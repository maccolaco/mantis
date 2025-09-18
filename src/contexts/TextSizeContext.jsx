import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TextSizeContext = createContext();

export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider');
  }
  return context;
};

// Text size scales - each level multiplies the base font size
const TEXT_SIZE_SCALES = {
  'extra-small': 0.75,
  'small': 0.875,
  'medium': 1,
  'large': 1.125,
  'extra-large': 1.25
};

const TEXT_SIZE_LABELS = {
  'extra-small': 'Extra Small',
  'small': 'Small',
  'medium': 'Medium (Default)',
  'large': 'Large',
  'extra-large': 'Extra Large'
};

export const TextSizeProvider = ({ children }) => {
  const [textSize, setTextSize] = useState(() => {
    const savedTextSize = localStorage.getItem('textSize');
    return savedTextSize && TEXT_SIZE_SCALES[savedTextSize] ? savedTextSize : 'medium';
  });

  useEffect(() => {
    localStorage.setItem('textSize', textSize);
    
    // Apply text size to document root
    const scale = TEXT_SIZE_SCALES[textSize];
    document.documentElement.style.fontSize = `${16 * scale}px`;
  }, [textSize]);

  const changeTextSize = (newSize) => {
    if (TEXT_SIZE_SCALES[newSize]) {
      setTextSize(newSize);
    }
  };

  const getTextSizeScale = () => TEXT_SIZE_SCALES[textSize];
  
  const getTextSizeLabel = () => TEXT_SIZE_LABELS[textSize];

  const getAllTextSizes = () => Object.keys(TEXT_SIZE_SCALES).map(key => ({
    value: key,
    label: TEXT_SIZE_LABELS[key],
    scale: TEXT_SIZE_SCALES[key]
  }));

  const value = {
    textSize,
    textSizeScale: getTextSizeScale(),
    textSizeLabel: getTextSizeLabel(),
    changeTextSize,
    getAllTextSizes,
    TEXT_SIZE_SCALES,
    TEXT_SIZE_LABELS
  };

  return (
    <TextSizeContext.Provider value={value}>
      {children}
    </TextSizeContext.Provider>
  );
};

TextSizeProvider.propTypes = {
  children: PropTypes.node.isRequired
};