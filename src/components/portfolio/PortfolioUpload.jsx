import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

// project imports
import { usePortfolio } from 'contexts/PortfolioContext';
import portfolioService from 'services/portfolioService';

// assets
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';

export default function PortfolioUpload({ onUploadComplete }) {
  const { dispatch, actions } = usePortfolio();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const portfolio = await portfolioService.parsePortfolioFile(file);
      dispatch({ type: actions.ADD_PORTFOLIO, payload: portfolio });
      
      if (onUploadComplete) {
        onUploadComplete(portfolio);
      }
    } catch (err) {
      setError(`Error parsing file: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSamplePortfolio = () => {
    const samplePortfolio = portfolioService.generateSamplePortfolio();
    dispatch({ type: actions.ADD_PORTFOLIO, payload: samplePortfolio });
    
    if (onUploadComplete) {
      onUploadComplete(samplePortfolio);
    }
  };

  return (
    <MainCard title="Upload Portfolio">
      <Box>
        <Typography variant="h6" gutterBottom>
          Choose Portfolio File
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            border: '2px dashed',
            borderColor: dragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            bgcolor: dragActive ? 'primary.lighter' : 'background.paper',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.lighter'
            }
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          
          {uploading ? (
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography>Processing portfolio...</Typography>
            </Stack>
          ) : (
            <Stack spacing={2} alignItems="center">
              <CloudUploadOutlined style={{ fontSize: '3rem', color: 'primary.main' }} />
              <Typography variant="h6">
                Drop your portfolio file here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Expected columns: Symbol/Ticker, Quantity/Shares, Price, Sector (optional)
              </Typography>
            </Stack>
          )}
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<FileTextOutlined />}
            onClick={handleSamplePortfolio}
            disabled={uploading}
          >
            Load Sample Portfolio
          </Button>
        </Stack>
      </Box>
    </MainCard>
  );
}

PortfolioUpload.propTypes = {
  onUploadComplete: PropTypes.func
};