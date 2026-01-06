'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';

type ParsedData = {
  text: string;
  filename: string;
  fileType: string;
  wordCount: number;
  charCount: number;
};

export default function IndividualPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse file');
      }

      setParsedData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Individual TELOS Generation
          </h1>
          <p className="text-gray-600">
            Upload your CV to get started. We'll extract the information and guide you through creating your TELOS file.
          </p>
        </div>

        {!parsedData ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Step 1: Upload Your CV
            </h2>
            <FileUpload
              onFileSelect={handleFileSelect}
              entityType="individual"
              acceptedFileTypes={['.pdf', '.docx', '.txt']}
            />

            {isLoading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">Extracting text from your CV...</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                CV Extracted Successfully
              </h2>
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Upload Different File
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Filename</p>
                  <p className="font-medium text-gray-900">{parsedData.filename}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Word Count</p>
                  <p className="font-medium text-gray-900">{parsedData.wordCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Characters</p>
                  <p className="font-medium text-gray-900">{parsedData.charCount.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Extracted Text Preview</p>
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {parsedData.text.length > 2000
                      ? parsedData.text.substring(0, 2000) + '...'
                      : parsedData.text}
                  </pre>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => {
                    // TODO: Move to question flow (Phase 5)
                    alert('Question flow coming in Phase 5!');
                  }}
                >
                  Continue to Questions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
