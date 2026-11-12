import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageWrapper from '@/components/Layout/PageWrapper';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, X, AlertCircle, Download, Upload } from 'lucide-react';
import { NutritionDataRow, processExcelFile, generateTemplate } from '@/utils/excelProcessor';
import { useData } from '@/context/DataContext';
import { downloadTestData } from '@/utils/testDataGenerator';

const DataImport = () => {
  usePageTitle('Data Import');
  const { toast } = useToast();
  const { importData } = useData();
  const [activeTab, setActiveTab] = useState('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [pendingData, setPendingData] = useState<NutritionDataRow[]>([]);
  const [approvedData, setApprovedData] = useState<NutritionDataRow[]>([]);
  const [rejectedData, setRejectedData] = useState<NutritionDataRow[]>([]);
  const [importHistory, setImportHistory] = useState<Array<{
    date: string;
    fileName: string;
    recordCount: number;
    status: 'success' | 'partial' | 'failed';
  }>>([
    {
      date: new Date().toLocaleString(),
      fileName: 'sample_nutrition_data.csv',
      recordCount: 23,
      status: 'success'
    }
  ]);
  const [validationErrors, setValidationErrors] = useState<Array<{
    row: number;
    field: string;
    message: string;
  }>>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Basic file type validation
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file format',
        description: 'Please upload an Excel or CSV file (.xlsx, .xls, or .csv)',
        variant: 'destructive',
      });
      return;
    }

    // Size validation (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setValidationErrors([]);
    
    try {
      const result = await processExcelFile(file);
      
      if (result.isValid) {
        setPendingData(result.data);
        setApprovedData([]);
        setRejectedData([]);
        setValidationErrors([]);
        setActiveTab('review');
        
        // Add to import history
        setImportHistory(prev => [
          {
            date: new Date().toLocaleString(),
            fileName: file.name,
            recordCount: result.data.length,
            status: 'success'
          },
          ...prev
        ]);
        
        toast({
          title: 'File processed successfully',
          description: `${result.data.length} records ready for review`,
        });
      } else {
        setValidationErrors(result.errors);
        setActiveTab('upload');
        
        // Add to import history with failed status
        setImportHistory(prev => [
          {
            date: new Date().toLocaleString(),
            fileName: file.name,
            recordCount: 0,
            status: 'failed'
          },
          ...prev
        ]);
        
        toast({
          title: 'Validation errors',
          description: `${result.errors.length} errors found in the file`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error processing file:', error);
      
      // Add to import history with failed status
      setImportHistory(prev => [
        {
          date: new Date().toLocaleString(),
          fileName: file.name,
          recordCount: 0,
          status: 'failed'
        },
        ...prev
      ]);
      
      toast({
        title: 'Error processing file',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateBlob = generateTemplate();
    const url = URL.createObjectURL(templateBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NutritionDataTemplate.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleApproveAll = () => {
    setApprovedData([...approvedData, ...pendingData.map(d => ({ ...d, validationStatus: 'approved' }))]);
    setPendingData([]);
    toast({
      title: 'All data approved',
      description: 'The data has been approved and is ready for publication',
    });
  };

  const handleApproveRow = (index: number) => {
    const row = pendingData[index];
    setApprovedData([...approvedData, { ...row, validationStatus: 'approved' }]);
    
    const newPendingData = [...pendingData];
    newPendingData.splice(index, 1);
    setPendingData(newPendingData);
    
    toast({
      title: 'Row approved',
      description: `Data for ${row.indicator} has been approved`,
    });
  };

  const handleRejectRow = (index: number) => {
    const row = pendingData[index];
    setRejectedData([...rejectedData, { ...row, validationStatus: 'rejected' }]);
    
    const newPendingData = [...pendingData];
    newPendingData.splice(index, 1);
    setPendingData(newPendingData);
    
    toast({
      title: 'Row rejected',
      description: `Data for ${row.indicator} has been rejected`,
    });
  };

  const handlePublishData = () => {
    if (approvedData.length === 0) {
      toast({
        title: 'No data to publish',
        description: 'Please approve some data before publishing',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Import the approved data into the application
      importData(approvedData);
      
      // Update import history with successful publish
      setImportHistory(prev => [
        {
          date: new Date().toLocaleString(),
          fileName: 'Published Data',
          recordCount: approvedData.length,
          status: approvedData.length === pendingData.length ? 'success' : 'partial'
        },
        ...prev
      ]);
      
      // Reset the data states
      setPendingData([]);
      setApprovedData([]);
      setRejectedData([]);
      
      // Show success message
      toast({
        title: 'Data published successfully',
        description: `${approvedData.length} records have been imported into the dashboard`,
      });
      
      // Switch back to upload tab
      setActiveTab('upload');
    } catch (error) {
      console.error('Error publishing data:', error);
      toast({
        title: 'Error publishing data',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageWrapper title="Data Import">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="review">Review Data</TabsTrigger>
          <TabsTrigger value="history">Import History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Nutrition Data</h2>
            <p className="text-gray-600 mb-6">
              Upload Excel files containing nutrition indicators data. The file should include columns for month, indicator, value, and optionally province and district.
            </p>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  {/* sr-only keeps the input focusable, so Enter and Space open the picker */}
                  <input
                    id="nutrition-file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => {
                      setSelectedFileName(e.target.files?.[0]?.name ?? '');
                      handleFileUpload(e);
                    }}
                    disabled={isProcessing}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="nutrition-file"
                    className={cn(
                      buttonVariants({ variant: 'default' }),
                      'h-11 w-full cursor-pointer sm:w-auto',
                      'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
                      'peer-disabled:pointer-events-none peer-disabled:opacity-50'
                    )}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose file
                  </label>
                  <p className="mt-2 text-sm text-gray-600">
                    Accepted: Excel (.xlsx, .xls) or CSV (.csv), up to 5 MB.
                  </p>
                  {selectedFileName && (
                    <p className="mt-1 text-sm font-medium text-gray-900 break-all" aria-live="polite">
                      Selected file: {selectedFileName}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={handleDownloadTemplate}
                  className="whitespace-nowrap"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
                <Button 
                  variant="outline"
                  onClick={downloadTestData}
                  className="whitespace-nowrap"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Test Data
                </Button>
              </div>
              
              {isProcessing && (
                <div className="py-2">
                  <p className="text-sm text-gray-500">Processing file, please wait...</p>
                </div>
              )}
              
              {validationErrors.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="text-sm font-medium mb-2">Validation errors:</div>
                    <ul className="text-sm list-disc list-inside">
                      {validationErrors.slice(0, 5).map((error, idx) => (
                        <li key={idx}>
                          Row {error.row}: {error.message}
                        </li>
                      ))}
                      {validationErrors.length > 5 && (
                        <li>...and {validationErrors.length - 5} more errors</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">Required Fields:</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  <li>month - Month of data collection (e.g., January, February)</li>
                  <li>indicator - Name of the indicator (e.g., "Children under five measured")</li>
                  <li>value - Numeric value for the indicator</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">Optional Fields:</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  <li>province - Province name</li>
                  <li>district - District name</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">Validation Rules:</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  <li>All required fields must be present</li>
                  <li>Values must be valid numbers</li>
                  <li>BMI values must be between 10 and 50</li>
                  <li>Birth weight values must be between 0.5 and 6 kg</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="review" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Review Data</h2>
              {pendingData.length > 0 && (
                <Button onClick={handleApproveAll} className="bg-[#22C55E] hover:bg-[#16A34A]">
                  Approve All ({pendingData.length})
                </Button>
              )}
            </div>
            
            {pendingData.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No data available for review. Upload a file to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Indicator</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Province</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{row.indicator}</TableCell>
                        <TableCell className="text-right font-mono">{row.value.toLocaleString()}</TableCell>
                        <TableCell>{row.province || '-'}</TableCell>
                        <TableCell>{row.district || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApproveRow(idx)}
                              className="text-green-600 hover:text-green-800 hover:bg-green-100"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRejectRow(idx)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-100"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
          
          {approvedData.length > 0 && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Approved Data</h2>
                <Button onClick={handlePublishData} className="bg-[#22C55E] hover:bg-[#16A34A]">
                  <Upload className="mr-2 h-4 w-4" />
                  Publish Data
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Indicator</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Province</TableHead>
                      <TableHead>District</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{row.indicator}</TableCell>
                        <TableCell className="text-right font-mono">{row.value.toLocaleString()}</TableCell>
                        <TableCell>{row.province || '-'}</TableCell>
                        <TableCell>{row.district || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Import History</h2>
            {importHistory.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No import history available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead className="text-right">Records</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importHistory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.fileName}</TableCell>
                        <TableCell className="text-right">{item.recordCount}</TableCell>
                        <TableCell>
                          {item.status === 'success' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="w-3 h-3 mr-1" />
                              Success
                            </span>
                          )}
                          {item.status === 'partial' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Partial
                            </span>
                          )}
                          {item.status === 'failed' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="w-3 h-3 mr-1" />
                              Failed
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default DataImport;
