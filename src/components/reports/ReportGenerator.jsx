import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// third-party
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// project imports
import { usePortfolio } from 'contexts/PortfolioContext';
import useRiskStore from 'stores/riskStore';

// assets
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';

export default function ReportGenerator({ open, onClose }) {
  const { currentPortfolio } = usePortfolio();
  const { riskMetrics, stressTestResults, insights } = useRiskStore();
  
  const [reportType, setReportType] = useState('comprehensive');
  const [sections, setSections] = useState({
    summary: true,
    holdings: true,
    riskMetrics: true,
    stressTests: true,
    insights: true,
    charts: true
  });
  const [reportTitle, setReportTitle] = useState('Portfolio Risk Report');
  const [generating, setGenerating] = useState(false);

  const handleSectionChange = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generatePDFReport = async () => {
    if (!currentPortfolio) return;

    setGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title Page
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(reportTitle, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text(currentPortfolio.name, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });

      yPosition += 30;

      // Executive Summary
      if (sections.summary) {
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Executive Summary', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        
        const summaryText = [
          `Portfolio Value: $${(riskMetrics?.totalValue || 0).toLocaleString()}`,
          `Number of Holdings: ${currentPortfolio.holdings.length}`,
          `Total P&L: $${(riskMetrics?.totalPnL || 0).toLocaleString()} (${((riskMetrics?.totalPnLPercent || 0) * 100).toFixed(2)}%)`,
          `Value at Risk (95%): ${(Math.abs(riskMetrics?.var95 || 0) * 100).toFixed(2)}%`,
          `Sharpe Ratio: ${(riskMetrics?.sharpeRatio || 0).toFixed(2)}`,
          `Maximum Drawdown: ${((riskMetrics?.maxDrawdown?.maxDrawdown || 0) * 100).toFixed(2)}%`
        ];

        summaryText.forEach(line => {
          pdf.text(line, 20, yPosition);
          yPosition += 7;
        });

        yPosition += 10;
      }

      // Risk Metrics
      if (sections.riskMetrics && riskMetrics) {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Risk Metrics', 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');

        const riskData = [
          ['Metric', 'Value', 'Assessment'],
          ['Value at Risk (95%)', `${(Math.abs(riskMetrics.var95 || 0) * 100).toFixed(2)}%`, Math.abs(riskMetrics.var95 || 0) > 0.05 ? 'High Risk' : 'Moderate Risk'],
          ['Conditional VaR', `${(Math.abs(riskMetrics.cvar95 || 0) * 100).toFixed(2)}%`, ''],
          ['Sharpe Ratio', (riskMetrics.sharpeRatio || 0).toFixed(2), riskMetrics.sharpeRatio > 1 ? 'Good' : 'Poor'],
          ['Sortino Ratio', (riskMetrics.sortinoRatio || 0).toFixed(2), ''],
          ['Portfolio Beta', (riskMetrics.beta || 0).toFixed(2), riskMetrics.beta > 1 ? 'High Beta' : 'Low Beta'],
          ['Max Concentration', `${((riskMetrics.maxConcentration || 0) * 100).toFixed(1)}%`, riskMetrics.maxConcentration > 0.2 ? 'High' : 'Acceptable'],
          ['Volatility', `${((riskMetrics.volatility || 0) * 100).toFixed(1)}%`, '']
        ];

        // Simple table
        const startX = 20;
        const colWidths = [60, 40, 40];
        let tableY = yPosition;

        riskData.forEach((row, index) => {
          let currentX = startX;
          
          if (index === 0) {
            pdf.setFont('helvetica', 'bold');
          } else {
            pdf.setFont('helvetica', 'normal');
          }

          row.forEach((cell, cellIndex) => {
            pdf.text(cell, currentX, tableY);
            currentX += colWidths[cellIndex];
          });
          
          tableY += 7;
        });

        yPosition = tableY + 10;
      }

      // Holdings Summary
      if (sections.holdings) {
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Portfolio Holdings', 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        
        const headers = ['Symbol', 'Quantity', 'Price', 'Value', 'Weight', 'P&L'];
        let currentX = 20;
        const colWidths = [25, 25, 25, 30, 25, 25];
        
        headers.forEach((header, index) => {
          pdf.text(header, currentX, yPosition);
          currentX += colWidths[index];
        });
        
        yPosition += 7;
        pdf.setFont('helvetica', 'normal');

        currentPortfolio.holdings.slice(0, 15).forEach(holding => { // Limit to first 15 holdings
          currentX = 20;
          const currentValue = holding.currentValue || holding.marketValue;
          const weight = (currentValue / (riskMetrics?.totalValue || 1)) * 100;
          const pnl = holding.pnl || 0;
          
          const rowData = [
            holding.symbol,
            holding.quantity.toLocaleString(),
            `$${(holding.currentPrice || holding.price).toFixed(2)}`,
            `$${currentValue.toLocaleString()}`,
            `${weight.toFixed(1)}%`,
            `$${pnl.toLocaleString()}`
          ];

          rowData.forEach((cell, index) => {
            pdf.text(cell, currentX, yPosition);
            currentX += colWidths[index];
          });
          
          yPosition += 6;
          
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
        });

        if (currentPortfolio.holdings.length > 15) {
          yPosition += 5;
          pdf.setFont('helvetica', 'italic');
          pdf.text(`... and ${currentPortfolio.holdings.length - 15} more holdings`, 20, yPosition);
        }
      }

      // Key Insights
      if (sections.insights && insights) {
        pdf.addPage();
        yPosition = 20;

        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Key Insights & Recommendations', 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');

        const allInsights = [
          ...(insights.riskInsights || []),
          ...(insights.concentrationInsights || []),
          ...(insights.performanceInsights || [])
        ].slice(0, 10); // Limit to top 10 insights

        allInsights.forEach((insight, index) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFont('helvetica', 'bold');
          pdf.text(`${index + 1}. ${insight.title}`, 20, yPosition);
          yPosition += 7;

          pdf.setFont('helvetica', 'normal');
          const lines = pdf.splitTextToSize(insight.message, pageWidth - 40);
          lines.forEach(line => {
            pdf.text(line, 25, yPosition);
            yPosition += 5;
          });

          yPosition += 5;
        });
      }

      // Footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
        pdf.text('Generated by Portfolio Risk Management System', 20, pageHeight - 10);
      }

      // Save the PDF
      const fileName = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF report:', error);
    } finally {
      setGenerating(false);
      onClose();
    }
  };

  const generateExcelReport = async () => {
    // For Excel export, we'll create a CSV file with comprehensive data
    if (!currentPortfolio) return;

    setGenerating(true);

    try {
      let csvContent = '';
      
      // Portfolio Summary
      csvContent += 'Portfolio Risk Report\n';
      csvContent += `Generated on,${new Date().toLocaleDateString()}\n`;
      csvContent += `Portfolio Name,${currentPortfolio.name}\n`;
      csvContent += `Total Value,$${(riskMetrics?.totalValue || 0).toLocaleString()}\n`;
      csvContent += `Total P&L,$${(riskMetrics?.totalPnL || 0).toLocaleString()}\n`;
      csvContent += `P&L Percentage,${((riskMetrics?.totalPnLPercent || 0) * 100).toFixed(2)}%\n`;
      csvContent += '\n';

      // Risk Metrics
      if (sections.riskMetrics && riskMetrics) {
        csvContent += 'Risk Metrics\n';
        csvContent += 'Metric,Value\n';
        csvContent += `Value at Risk (95%),${(Math.abs(riskMetrics.var95 || 0) * 100).toFixed(2)}%\n`;
        csvContent += `Conditional VaR,${(Math.abs(riskMetrics.cvar95 || 0) * 100).toFixed(2)}%\n`;
        csvContent += `Sharpe Ratio,${(riskMetrics.sharpeRatio || 0).toFixed(2)}\n`;
        csvContent += `Sortino Ratio,${(riskMetrics.sortinoRatio || 0).toFixed(2)}\n`;
        csvContent += `Portfolio Beta,${(riskMetrics.beta || 0).toFixed(2)}\n`;
        csvContent += `Maximum Drawdown,${((riskMetrics.maxDrawdown?.maxDrawdown || 0) * 100).toFixed(2)}%\n`;
        csvContent += `Volatility,${((riskMetrics.volatility || 0) * 100).toFixed(1)}%\n`;
        csvContent += '\n';
      }

      // Holdings
      if (sections.holdings) {
        csvContent += 'Portfolio Holdings\n';
        csvContent += 'Symbol,Quantity,Price,Current Price,Market Value,Current Value,P&L,P&L %,Weight,Sector\n';
        
        currentPortfolio.holdings.forEach(holding => {
          const currentPrice = holding.currentPrice || holding.price;
          const currentValue = holding.currentValue || holding.marketValue;
          const pnl = holding.pnl || 0;
          const pnlPercent = holding.pnlPercent || 0;
          const weight = (currentValue / (riskMetrics?.totalValue || 1)) * 100;
          
          csvContent += `${holding.symbol},${holding.quantity},${holding.price},${currentPrice},${holding.marketValue},${currentValue},${pnl},${(pnlPercent * 100).toFixed(2)}%,${weight.toFixed(2)}%,${holding.sector}\n`;
        });
        csvContent += '\n';
      }

      // Sector Allocation
      if (riskMetrics?.sectorAllocation) {
        csvContent += 'Sector Allocation\n';
        csvContent += 'Sector,Weight\n';
        Object.entries(riskMetrics.sectorAllocation).forEach(([sector, weight]) => {
          csvContent += `${sector},${(weight * 100).toFixed(2)}%\n`;
        });
        csvContent += '\n';
      }

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating Excel report:', error);
    } finally {
      setGenerating(false);
      onClose();
    }
  };

  const handleGenerate = () => {
    if (reportType === 'pdf') {
      generatePDFReport();
    } else {
      generateExcelReport();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileTextOutlined />
          Generate Risk Report
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Report Title"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            fullWidth
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">Report Format</FormLabel>
            <RadioGroup
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <FormControlLabel value="pdf" control={<Radio />} label="PDF Report (Formatted)" />
              <FormControlLabel value="excel" control={<Radio />} label="Excel/CSV (Data Export)" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Include Sections</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sections.summary}
                    onChange={() => handleSectionChange('summary')}
                  />
                }
                label="Executive Summary"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sections.holdings}
                    onChange={() => handleSectionChange('holdings')}
                  />
                }
                label="Portfolio Holdings"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sections.riskMetrics}
                    onChange={() => handleSectionChange('riskMetrics')}
                  />
                }
                label="Risk Metrics"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sections.stressTests}
                    onChange={() => handleSectionChange('stressTests')}
                  />
                }
                label="Stress Test Results"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sections.insights}
                    onChange={() => handleSectionChange('insights')}
                  />
                }
                label="Insights & Recommendations"
              />
            </FormGroup>
          </FormControl>

          {!currentPortfolio && (
            <Typography variant="body2" color="error">
              No portfolio loaded. Please upload a portfolio first.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={generating}>
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          disabled={!currentPortfolio || generating}
          startIcon={generating ? <CircularProgress size={16} /> : <DownloadOutlined />}
        >
          {generating ? 'Generating...' : 'Generate Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ReportGenerator.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};