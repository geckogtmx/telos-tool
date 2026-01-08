'use client';

import { useState, useEffect, Suspense } from 'react';
import FileUpload from '@/components/FileUpload';
import FullQuestionFlow from '@/components/FullQuestionFlow';
import TELOSPreview from '@/components/TELOSPreview';
import { individualFullQuestions, FullQuestionAnswers } from '@/config/questions/individual-full';
import { HostingType } from '@/types';
import { QuickQuestionAnswers } from '@/config/questions/individual-quick';

type PIIMatch = {
  type: string;
  count: number;
};

type ParsedData = {
  text: string;
  filename: string;
  fileType: string;
  wordCount: number;
  charCount: number;
  piiRemoved?: PIIMatch[];
  piiSummary?: string;
  totalPIIRemoved?: number;
};

type GeneratedTELOS = {
  content: string;
  entityName: string;
  generatedAt: string;
};

function IndividualFullFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<FullQuestionAnswers>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTELOS, setGeneratedTELOS] = useState<GeneratedTELOS | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [showCVUpload, setShowCVUpload] = useState(true);

  // Check for upgrade data on mount
  useEffect(() => {
    const upgradeJson = sessionStorage.getItem('telos_upgrade_data');
    if (upgradeJson) {
      try {
        const data = JSON.parse(upgradeJson);
        
        // Map Quick answers to Full answers
        const quickAnswers = data.answers as QuickQuestionAnswers;
        const mappedAnswers: FullQuestionAnswers = {};

        if (quickAnswers.q1) mappedAnswers.q1 = quickAnswers.q1;
        if (quickAnswers.q2) {
            mappedAnswers.q2 = quickAnswers.q2; // Note: Q2 in Full is "What are you trying to accomplish?", same as Quick
            mappedAnswers.q2a = quickAnswers.q2; // Pre-fill specific problems
            mappedAnswers.q2b = quickAnswers.q2; // Pre-fill mission
        }
        if (quickAnswers.q3) mappedAnswers.q3 = quickAnswers.q3;
        if (quickAnswers.q4) mappedAnswers.q4 = quickAnswers.q4;
        if (quickAnswers.q5) mappedAnswers.q6a = quickAnswers.q5; // Map to Active Projects

        setAnswers(mappedAnswers);
        
        if (data.parsedData) {
          setParsedData(data.parsedData);
          setShowCVUpload(false);
        }
        
        setIsUpgrade(true);
        // Clear session storage so it doesn't persist forever
        sessionStorage.removeItem('telos_upgrade_data');
      } catch (e) {
        console.error('Failed to parse upgrade data', e);
      }
    }
  }, []);

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
      setShowCVUpload(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionComplete = (completedAnswers: FullQuestionAnswers) => {
    setAnswers(completedAnswers);
    handleGenerateTELOS(completedAnswers);
  };

  const handleGenerateTELOS = async (currentAnswers: FullQuestionAnswers) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-telos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'individual_full',
          parsedInput: parsedData?.text || '',
          answers: currentAnswers,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate TELOS');
      }

      setGeneratedTELOS({
        content: result.data.content,
        entityName: result.data.entityName,
        generatedAt: result.data.generatedAt,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadTELOS = () => {
    if (!generatedTELOS) return;

    const filename = `Full_TELOS_${generatedTELOS.entityName.replace(/\s+/g, '_')}.md`;
    const blob = new Blob([generatedTELOS.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBackToQuestions = () => {
    setGeneratedTELOS(null);
  };

  const handleSaveTELOS = async (hostingType: HostingType, password?: string) => {
    if (!generatedTELOS) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/save-telos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'individual_full',
          entityName: generatedTELOS.entityName,
          rawInput: {
            filename: parsedData?.filename,
            parsedText: parsedData?.text,
            answers: answers,
            upgradedFromQuick: isUpgrade
          },
          generatedContent: generatedTELOS.content,
          hostingType,
          password
        })
      });

      const result = await response.json();
      if (!result.success) {
         throw new Error(result.error || 'Failed to save');
      }

      window.location.href = `/t/${result.data.public_id}`;
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to save'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Individual Full TELOS
          </h1>
          <p className="text-gray-400">
            Create a comprehensive professional operating system across 7 dimensions.
          </p>
        </div>

        {generatedTELOS ? (
          <TELOSPreview
            content={generatedTELOS.content}
            entityName={generatedTELOS.entityName}
            onDownload={handleDownloadTELOS}
            onBack={handleBackToQuestions}
            onSave={handleSaveTELOS}
            isSaving={isSaving}
          />
        ) : (
          <div className="space-y-10">
            {/* Step 1: CV Upload (Only if not already parsed or explicitly requested) */}
            {showCVUpload && !parsedData && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                  Step 1: AI Assistance (Optional)
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Upload your CV to help the AI generate more accurate responses.
                </p>
                
                <FileUpload
                  onFileSelect={handleFileSelect}
                  entityType="individual"
                  acceptedFileTypes={['.pdf', '.docx', '.txt']}
                />

                {isLoading && (
                  <div className="mt-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-sm text-gray-400">Extracting text...</p>
                  </div>
                )}
              </div>
            )}

            {/* Parsed File Indicator */}
            {parsedData && (
              <div className="bg-gray-800/50 border border-blue-900/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl text-blue-400">📄</div>
                  <div>
                    <p className="font-medium text-gray-100">{parsedData.filename || 'Uploaded CV'}</p>
                    <p className="text-sm text-gray-400">{parsedData.wordCount} words available for context</p>
                  </div>
                </div>
                {!isUpgrade && (
                  <button 
                    onClick={() => { setParsedData(null); setShowCVUpload(true); setFile(null); }}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
            
            {parsedData?.totalPIIRemoved && parsedData.totalPIIRemoved > 0 && (
              <div className="bg-yellow-950 border border-yellow-800 rounded-md p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-200 mb-1">
                      Sensitive Information Removed
                    </h3>
                    <p className="text-sm text-yellow-300">
                      {parsedData.piiSummary}
                    </p>
                    <p className="text-xs text-yellow-400 mt-2">
                      Your privacy is protected. The text below has been sanitized and is safe to use.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Full Questions Flow */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-4 md:p-8">
               {isUpgrade && (
                <div className="mb-6 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    <strong>Welcome back!</strong> We've pre-filled some answers from your Quick TELOS. Please review and expand on them below.
                  </p>
                </div>
               )}

              <FullQuestionFlow
                questions={individualFullQuestions}
                onComplete={handleQuestionComplete}
                initialAnswers={answers}
              />
            </div>

            {isGenerating && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold text-white mb-2">Synthesizing Full TELOS</h3>
                  <p className="text-gray-400">This is a complex generation task and may take 15-20 seconds...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function IndividualFullPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <IndividualFullFlow />
    </Suspense>
  );
}