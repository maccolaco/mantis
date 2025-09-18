import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import { useTheme } from 'contexts/ThemeContext';
import { useTextSize } from 'contexts/TextSizeContext';
import { usePortfolio } from 'contexts/PortfolioContext';

// assets
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

export default function PortfolioSettings() {
  const { mode, toggleMode } = useTheme();
  const { textSize, changeTextSize, getAllTextSizes, textSizeLabel } = useTextSize();
  const { preferences, dispatch, actions } = usePortfolio();
  
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [saved, setSaved] = useState(false);

  const handlePreferenceChange = (key, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRiskThresholdChange = (key, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      riskThresholds: {
        ...prev.riskThresholds,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    dispatch({ type: actions.UPDATE_PREFERENCES, payload: localPreferences });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultPreferences = {
      refreshInterval: 30000,
      riskThresholds: {
        maxDrawdown: 0.1,
        volatility: 0.25,
        concentration: 0.3
      }
    };
    setLocalPreferences(defaultPreferences);
    dispatch({ type: actions.UPDATE_PREFERENCES, payload: defaultPreferences });
    changeTextSize('medium');
  };

  const textSizeOptions = getAllTextSizes();

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your portfolio management experience
        </Typography>
      </Grid>

      {saved && (
        <Grid size={12}>
          <Alert severity="success" onClose={() => setSaved(false)}>
            Settings saved successfully!
          </Alert>
        </Grid>
      )}

      {/* Display Settings */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <MainCard title="Display Settings">
          <Stack spacing={3}>
            {/* Theme Mode */}
            <Box>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Typography variant="subtitle1" gutterBottom>
                    Theme Mode
                  </Typography>
                </FormLabel>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={toggleMode}
                      color="primary"
                    />
                  }
                  label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                />
              </FormControl>
            </Box>

            <Divider />

            {/* Text Size */}
            <Box>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">
                  <Typography variant="subtitle1" gutterBottom>
                    Text Size
                  </Typography>
                </FormLabel>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current: {textSizeLabel}
                </Typography>
                <RadioGroup
                  value={textSize}
                  onChange={(e) => changeTextSize(e.target.value)}
                  name="text-size-group"
                >
                  {textSizeOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ fontSize: `${0.875 * option.scale}rem` }}
                          >
                            {option.label}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ fontSize: `${0.75 * option.scale}rem` }}
                          >
                            Sample text at {Math.round(option.scale * 100)}% size
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </Stack>
        </MainCard>
      </Grid>

      {/* Portfolio Settings */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <MainCard title="Portfolio Settings">
          <Stack spacing={3}>
            {/* Refresh Interval */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Data Refresh Interval
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {localPreferences.refreshInterval / 1000} seconds
              </Typography>
              <Slider
                value={localPreferences.refreshInterval / 1000}
                onChange={(e, value) => handlePreferenceChange('refreshInterval', value * 1000)}
                min={10}
                max={300}
                step={10}
                marks={[
                  { value: 10, label: '10s' },
                  { value: 30, label: '30s' },
                  { value: 60, label: '1m' },
                  { value: 300, label: '5m' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}s`}
              />
            </Box>

            <Divider />

            {/* Risk Thresholds */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Risk Alert Thresholds
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Maximum Drawdown: {(localPreferences.riskThresholds.maxDrawdown * 100).toFixed(0)}%
                  </Typography>
                  <Slider
                    value={localPreferences.riskThresholds.maxDrawdown}
                    onChange={(e, value) => handleRiskThresholdChange('maxDrawdown', value)}
                    min={0.05}
                    max={0.5}
                    step={0.01}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Portfolio Volatility: {(localPreferences.riskThresholds.volatility * 100).toFixed(0)}%
                  </Typography>
                  <Slider
                    value={localPreferences.riskThresholds.volatility}
                    onChange={(e, value) => handleRiskThresholdChange('volatility', value)}
                    min={0.1}
                    max={0.8}
                    step={0.01}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Position Concentration: {(localPreferences.riskThresholds.concentration * 100).toFixed(0)}%
                  </Typography>
                  <Slider
                    value={localPreferences.riskThresholds.concentration}
                    onChange={(e, value) => handleRiskThresholdChange('concentration', value)}
                    min={0.1}
                    max={0.8}
                    step={0.01}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </MainCard>
      </Grid>

      {/* Action Buttons */}
      <Grid size={12}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<ReloadOutlined />}
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveOutlined />}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Stack>
      </Grid>

      {/* Preview Card */}
      <Grid size={12}>
        <MainCard title="Preview">
          <Typography variant="body1" paragraph>
            This is a preview of how text will appear with your current settings. 
            The text size setting affects all typography throughout the application, 
            including headings, body text, buttons, and form elements.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Sample Heading
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sample secondary text with current text size: {textSizeLabel}
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}