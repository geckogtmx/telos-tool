'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import QuestionFlow from '@/components/QuestionFlow';
import TELOSPreview from '@/components/TELOSPreview';
import { individualQuestions, type QuestionAnswers } from '@/config/questions/individual';
import { HostingType } from '@/types';
import { createClient } from '@/lib/supabase/client';

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

function IndividualFlow() {
  const searchParams = useSearchParams();
  const editingId = searchParams?.get('id');

  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTELOS, setGeneratedTELOS] = useState<GeneratedTELOS | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(!!editingId);
  const [initialHostingType, setInitialHostingType] = useState<HostingType | undefined>(undefined);

  // Load existing data if editingId is present
  useEffect(() => {
    if (editingId) {
      const loadExistingData = async () => {
        try {
          const supabase = createClient();
          const { data, error: fetchError } = await supabase
            .from('telos_files')
            .select('*')
            .eq('id', editingId)
            .single();

          if (fetchError) throw fetchError;

          if (data) {
            setParsedData({
              text: data.raw_input.parsedText,
              filename: data.raw_input.filename || 'Existing File',
              fileType: 'text/plain',
              wordCount: data.raw_input.parsedText.split(/\s+/).length,
              charCount: data.raw_input.parsedText.length
            });
            setAnswers(data.raw_input.answers || {});
            setInitialHostingType(data.hosting_type as HostingType);
            setShowQuestions(true); // Jump straight to questions for updates
          }
        } catch (err) {
          console.error('Error loading existing TELOS:', err);
          setError('Failed to load existing TELOS data.');
        } finally {
          setIsInitialLoading(false);
        }
      };

      loadExistingData();
    }
  }, [editingId]);

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
    setShowQuestions(false);
    setAnswers({});
  };

  const handleContinueToQuestions = () => {
    setShowQuestions(true);
  };

  const handleQuestionComplete = (completedAnswers: QuestionAnswers) => {
    setAnswers(completedAnswers);
  };

  const handleBackToPreview = () => {
    setShowQuestions(false);
  };

  const handleGenerateTELOS = async () => {
    if (!parsedData) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-telos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'individual',
          parsedInput: parsedData.text,
          answers,
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

    const filename = `TELOS_${generatedTELOS.entityName.replace(/\s+/g, '_')}.md`;
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
    if (!generatedTELOS || !parsedData) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      const apiEndpoint = editingId ? '/api/update-telos' : '/api/save-telos';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId, // Ignored by save-telos, required by update-telos
          entityType: 'individual',
          entityName: generatedTELOS.entityName,
          rawInput: {
            filename: parsedData.filename,
            parsedText: parsedData.text,
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

      // Redirect to the hosted page
      window.location.href = `/t/${result.data.public_id}`;

    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to save'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            {editingId ? 'Update TELOS' : 'Individual TELOS Generation'}
          </h1>
          <p className="text-gray-400">
            {editingId 
              ? 'Update your answers and re-generate your TELOS file.' 
              : 'Upload your CV to get started. We\'ll extract the information and guide you through creating your TELOS file.'}
          </p>
        </div>

        {!parsedData ? (
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Step 1: Upload Your CV
            </h2>
            <FileUpload
              onFileSelect={handleFileSelect}
              entityType="individual"
              acceptedFileTypes={['.pdf', '.docx', '.txt']}
            />

            {isLoading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-sm text-gray-400">Extracting text from your CV...</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-950 border border-red-800 rounded-md">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
          </div>
        ) : !showQuestions ? (
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-100">
                CV Extracted Successfully
              </h2>
              <button
                onClick={handleReset}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Upload Different File
              </button>
            </div>

            <div className="space-y-4">
              {parsedData.totalPIIRemoved && parsedData.totalPIIRemoved > 0 && (
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

              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-700">
                <div>
                  <p className="text-sm text-gray-500">Filename</p>
                  <p className="font-medium text-gray-200">{parsedData.filename}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Word Count</p>
                  <p className="font-medium text-gray-200">{parsedData.wordCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Characters</p>
                  <p className="font-medium text-gray-200">{parsedData.charCount.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Extracted Text Preview</p>
                <div className="bg-gray-800 border border-gray-700 rounded-md p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                    {parsedData.text.length > 2000
                      ? parsedData.text.substring(0, 2000) + '...'
                      : parsedData.text}
                  </pre>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors font-medium"
                  onClick={handleContinueToQuestions}
                >
                  Continue to Questions
                </button>
              </div>
            </div>
          </div>
        ) : generatedTELOS ? (
          <TELOSPreview
            content={generatedTELOS.content}
            entityName={generatedTELOS.entityName}
            onDownload={handleDownloadTELOS}
            onBack={handleBackToQuestions}
            onSave={handleSaveTELOS}
            isSaving={isSaving}
            initialHostingType={initialHostingType}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">
                    Step {editingId ? '1' : '2'}: {editingId ? 'Review' : 'Answer'} Questions
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Help us understand your professional identity and goals
                  </p>
                </div>
                {!editingId && (
                  <button
                    onClick={handleBackToPreview}
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Back to CV Preview
                  </button>
                )}
              </div>

              <QuestionFlow
                questions={individualQuestions}
                onComplete={handleQuestionComplete}
                initialAnswers={answers}
                showFinishButton={!editingId}
              />
            </div>

            {error && (
              <div className="bg-red-950 border border-red-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-red-200 mb-1">Generation Failed</h3>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {(editingId || (individualQuestions
              .filter(q => q.required)
              .every(q => answers[q.id] && answers[q.id].trim().length >= (q.minLength || 0)))) && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-1">
                      Ready to {editingId ? 'Update' : 'Generate'} Your TELOS
                    </h3>
                    <p className="text-sm text-gray-400">
                      {editingId ? 'Changes detected.' : 'All required questions answered.'} Click below to {editingId ? 'update' : 'create'} your TELOS file.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateTELOS}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      editingId ? 'Re-generate TELOS' : 'Generate TELOS'
                    )}
                  </button>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="bg-blue-950 border border-blue-800 rounded-lg p-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <div>
                    <p className="text-blue-200 font-medium">Generating your TELOS file...</p>
                    <p className="text-sm text-blue-300 mt-1">This may take 10-15 seconds</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function IndividualPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <IndividualFlow />
    </Suspense>
  );
}