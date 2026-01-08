'use client';

import { useState, Suspense } from 'react';
import FileUpload from '@/components/FileUpload';
import QuickQuestionFlow from '@/components/QuickQuestionFlow';
import TELOSPreview from '@/components/TELOSPreview';
import { individualQuickQuestions } from '@/config/questions/individual-quick';
import { QuestionAnswers } from '@/config/questions/individual';
import { HostingType } from '@/types';

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

function IndividualQuickFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTELOS, setGeneratedTELOS] = useState<GeneratedTELOS | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const handleQuestionComplete = (completedAnswers: QuestionAnswers) => {
    setAnswers(completedAnswers);
    handleGenerateTELOS(completedAnswers);
  };

  const handleGenerateTELOS = async (currentAnswers: QuestionAnswers) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-telos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'individual_quick',
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

    const filename = `Quick_TELOS_${generatedTELOS.entityName.replace(/\s+/g, '_')}.md`;
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
          entityType: 'individual_quick',
          entityName: generatedTELOS.entityName,
          rawInput: {
            filename: parsedData?.filename,
            parsedText: parsedData?.text,
            answers: answers,
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

  const handleUpgradeToFull = () => {
    // Pass answers to the full flow via session storage or state
    // For now, let's use session storage to pass data between pages
    const upgradeData = {
      answers,
      parsedData
    };
    sessionStorage.setItem('telos_upgrade_data', JSON.stringify(upgradeData));
    window.location.href = '/generate/individual_full';
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Individual Quick TELOS
          </h1>
          <p className="text-gray-400">
            Generate a basic TELOS in minutes. Answer 5 core questions to define your professional identity.
          </p>
        </div>

        {generatedTELOS ? (
          <div className="space-y-6">
            <TELOSPreview
              content={generatedTELOS.content}
              entityName={generatedTELOS.entityName}
              onDownload={handleDownloadTELOS}
              onBack={handleBackToQuestions}
              onSave={handleSaveTELOS}
              isSaving={isSaving}
            />
            
            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 mt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2">Want to go deeper?</h3>
                  <p className="text-blue-200">
                    Upgrade to a Full Profile to add 13 more dimensions to your TELOS, including technical context and life context.
                  </p>
                </div>
                <button
                  onClick={handleUpgradeToFull}
                  className="whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20"
                >
                  Continue to Full Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Step 1: Optional CV Upload */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-100">
                  Step 1: AI Assistance (Optional)
                </h2>
                {parsedData && (
                  <button
                    onClick={() => {setParsedData(null); setFile(null);}}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Remove CV
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-6">
                Upload your CV to help the AI generate more accurate responses. You can also skip this and just answer the questions.
              </p>
              
              {!parsedData ? (
                <FileUpload
                  onFileSelect={handleFileSelect}
                  entityType="individual"
                  acceptedFileTypes={['.pdf', '.docx', '.txt']}
                />
              ) : (
                <div className="bg-gray-800/50 border border-blue-900/50 rounded-lg p-4 flex items-center gap-4">
                  <div className="text-3xl text-blue-400">📄</div>
                  <div>
                    <p className="font-medium text-gray-100">{parsedData.filename}</p>
                    <p className="text-sm text-gray-400">{parsedData.wordCount} words extracted</p>
                  </div>
                  <div className="ml-auto text-green-400 flex items-center gap-1 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Parsed
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="mt-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-sm text-gray-400">Extracting text...</p>
                </div>
              )}
            </div>

            {/* Step 2: Questions */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-100">
                  Step 2: Core Questions
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  These answers will form the basis of your Quick TELOS.
                </p>
              </div>

              <QuickQuestionFlow
                questions={individualQuickQuestions}
                onComplete={handleQuestionComplete}
                initialAnswers={answers}
              />
            </div>

            {isGenerating && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold text-white mb-2">Generating Quick TELOS</h3>
                  <p className="text-gray-400">Brewing your professional identity... This usually takes 5-10 seconds.</p>
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

export default function IndividualQuickPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <IndividualQuickFlow />
    </Suspense>
  );
}
