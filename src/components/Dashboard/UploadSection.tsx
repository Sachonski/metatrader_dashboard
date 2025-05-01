import React, { useState } from 'react';
import FileUpload from '../UI/FileUpload';
import { TradingMetrics } from '../../types';
import { parseMetaTraderHtml, hasValidMetrics } from '../../utils/htmlParser';
import Card from '../UI/Card';
import { FileText, AlertTriangle } from 'lucide-react';

interface UploadSectionProps {
  onMetricsExtracted: (metrics: TradingMetrics) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onMetricsExtracted }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsLoading(true);
    setFileName(file.name);
    
    try {
      // Read the file content
      const fileContent = await file.text();
      
      // Parse the HTML content to extract metrics
      const metrics = parseMetaTraderHtml(fileContent);
      
      // Validate if we could extract metrics
      if (!hasValidMetrics(metrics)) {
        setError('Could not extract trading metrics from the uploaded file. Please ensure it is a valid MetaTrader 5 HTML report.');
      } else {
        // Pass the extracted metrics up
        onMetricsExtracted(metrics);
      }
    } catch (err) {
      setError('Error processing the file. Please try again.');
      console.error('File processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card title="Upload MetaTrader 5 Report" className="mb-6">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload an HTML report from MetaTrader 5 to visualize your trading performance metrics.
        </p>
        
        <FileUpload onFileSelect={handleFileSelect} />
        
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
            <span className="ml-2 text-sm text-gray-600">Processing report...</span>
          </div>
        )}
        
        {fileName && !error && !isLoading && (
          <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <FileText size={18} className="text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Successfully processed: <strong>{fileName}</strong>
            </span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
            <AlertTriangle size={18} className="text-red-600 dark:text-red-400 mr-2" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UploadSection;