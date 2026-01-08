'use client';

import { useState, Suspense } from 'react';
import OrgInputUpload from '@/components/OrgInputUpload';
import QuestionFlow from '@/components/QuestionFlow';
import TELOSPreview from '@/components/TELOSPreview';
import { organizationQuestions, OrganizationQuestionAnswers } from '@/config/questions/organization';
import { HostingType } from '@/types';

type GeneratedTELOS = {
  content: string;
  entityName: string;
  generatedAt: string;
};

function OrganizationFlow() {
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string>('');
  
  const [answers, setAnswers] = useState<OrganizationQuestionAnswers>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTELOS, setGeneratedTELOS] = useState<GeneratedTELOS | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleDataParsed = (text: string, source: string) => {
    setParsedText(text);
    setSourceName(source);
    // Try to extract a name from the text?
    // For now, we'll let the generator handle it or ask user?
    // The current flow doesn't ask for Entity Name explicitly, it extracts from text or uses generic.
  };

  const handleReset = () => {
    setParsedText(null);
    setSourceName('');
    setAnswers({});
    setError(null);
  };

  const handleQuestionComplete = (completedAnswers: OrganizationQuestionAnswers) => {
    setAnswers(completedAnswers);
    handleGenerateTELOS(completedAnswers);
  };

  const handleGenerateTELOS = async (currentAnswers: OrganizationQuestionAnswers) => {
    if (!parsedText) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-telos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'organization',
          parsedInput: parsedText,
          answers: currentAnswers,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate TELOS');
      }

      setGeneratedTELOS({
        content: result.data.content,
        entityName: result.data.entityName || 'Organization',
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
    if (!generatedTELOS) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/save-telos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'organization',
          entityName: generatedTELOS.entityName,
          rawInput: {
            source: sourceName,
            parsedText: parsedText,
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

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Organization TELOS
          </h1>
          <p className="text-gray-400">
            Define your organization's mission, values, and operating principles.
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
            {/* Step 1: Input */}
            {!parsedText ? (
              <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                  Step 1: Organization Context
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Provide your "About Us" page or company description to help the AI understand your organization.
                </p>
                
                <OrgInputUpload onDataParsed={handleDataParsed} />
              </div>
            ) : (
              <div className="bg-gray-800/50 border border-blue-900/50 rounded-lg p-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                  <div className="text-3xl text-blue-400">🏢</div>
                  <div>
                    <p className="font-medium text-gray-100">{sourceName}</p>
                    <p className="text-sm text-gray-400">{parsedText.length} characters loaded</p>
                  </div>
                </div>
                <button 
                  onClick={handleReset}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Change Source
                </button>
              </div>
            )}

            {/* Step 2: Questions */}
            {parsedText && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-100">
                    Step 2: Core Organizational Questions
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    These 7 questions frame the Corporate TELOS structure.
                  </p>
                </div>

                <QuestionFlow
                  questions={organizationQuestions}
                  onComplete={handleQuestionComplete}
                  initialAnswers={answers}
                />
              </div>
            )}

            {isGenerating && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold text-white mb-2">Generating Organization TELOS</h3>
                  <p className="text-gray-400">Synthesizing mission and operations...</p>
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

export default function OrganizationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <OrganizationFlow />
    </Suspense>
  );
}