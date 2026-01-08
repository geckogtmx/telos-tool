'use client';

import { useState, Suspense } from 'react';
import AgentInputUpload from '@/components/AgentInputUpload';
import QuestionFlow from '@/components/QuestionFlow';
import TELOSPreview from '@/components/TELOSPreview';
import { agentQuestions, AgentQuestionAnswers } from '@/config/questions/agent';
import { HostingType } from '@/types';

type GeneratedTELOS = {
  content: string;
  entityName: string;
  generatedAt: string;
};

function AgentFlow() {
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string>('');
  
  const [answers, setAnswers] = useState<AgentQuestionAnswers>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTELOS, setGeneratedTELOS] = useState<GeneratedTELOS | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);

  const handleDataParsed = (text: string, source: string) => {
    setParsedText(text);
    setSourceName(source);
  };

  const handleReset = () => {
    setParsedText(null);
    setSourceName('');
    setAnswers({});
    setError(null);
  };

  const handleQuestionComplete = (completedAnswers: AgentQuestionAnswers) => {
    setAnswers(completedAnswers);
    handleGenerateTELOS(completedAnswers);
  };

  const handleGenerateTELOS = async (currentAnswers: AgentQuestionAnswers) => {
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
          entityType: 'agent',
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
        entityName: result.data.entityName || 'AI Agent',
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

    try {
      const response = await fetch('/api/save-telos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'agent',
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
            Agent TELOS
          </h1>
          <p className="text-gray-400">
            Define an AI Agent&apos;s persona, constraints, and operating parameters.
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
                  Step 1: System Prompt / Config
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Provide the agent&apos;s system prompt or configuration file to extract its identity.
                </p>
                
                <AgentInputUpload onDataParsed={handleDataParsed} />
              </div>
            ) : (
              <div className="bg-gray-800/50 border border-blue-900/50 rounded-lg p-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                  <div className="text-3xl text-blue-400">🤖</div>
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
                    Step 2: Agent Persona Definition
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Refine the agent&apos;s behavior and constraints.
                  </p>
                </div>

                <QuestionFlow
                  questions={agentQuestions}
                  onComplete={handleQuestionComplete}
                  initialAnswers={answers}
                />
              </div>
            )}

            {isGenerating && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold text-white mb-2">Generating Agent TELOS</h3>
                  <p className="text-gray-400">Defining operating parameters...</p>
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

export default function AgentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <AgentFlow />
    </Suspense>
  );
}