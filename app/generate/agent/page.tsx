'use client';

import { useState, Suspense } from 'react';
import AgentInputUpload from '@/components/AgentInputUpload';
import QuestionFlow from '@/components/QuestionFlow';
import TELOSPreview from '@/components/TELOSPreview';
import { OutputTypeSelector } from '@/components/OutputTypeSelector';
import { PlatformSelector } from '@/components/PlatformSelector';
import { SystemPromptPreview } from '@/components/SystemPromptPreview';
import { SkillPreview } from '@/components/SkillPreview';
import { agentQuestions, skillQuestions, AgentQuestionAnswers } from '@/config/questions/agent';
import { HostingType } from '@/types';
import { OutputType, TargetPlatform, SkillOutput, OUTPUT_TYPE_INFO } from '@/types/output-types';
import { DEFAULT_OUTPUT_TYPE, DEFAULT_PLATFORM } from '@/config/constants';

type GeneratedContent = {
  content: string;
  entityName: string;
  generatedAt: string;
  outputType: OutputType;
  skillOutput?: SkillOutput;
};

function AgentFlow() {
  // Step tracking - Reordered: output-type -> input -> questions -> preview
  const [currentStep, setCurrentStep] = useState<'output-type' | 'input' | 'questions' | 'preview'>('output-type');

  // Input state
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string>('');

  // Output configuration
  const [outputType, setOutputType] = useState<OutputType>(DEFAULT_OUTPUT_TYPE);
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>(DEFAULT_PLATFORM);

  // Question answers
  const [answers, setAnswers] = useState<AgentQuestionAnswers>({});

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  const handleDataParsed = (text: string, source: string) => {
    setParsedText(text);
    setSourceName(source);
    setCurrentStep('questions');
  };

  const handleReset = () => {
    setParsedText(null);
    setSourceName('');
    setOutputType(DEFAULT_OUTPUT_TYPE);
    setTargetPlatform(DEFAULT_PLATFORM);
    setAnswers({});
    setError(null);
    setGeneratedContent(null);
    setCurrentStep('output-type');
  };

  const handleOutputTypeConfirm = () => {
    if (outputType === 'skill') {
      // For skills, we skip the raw input step and go straight to guided questions
      // This reduces redundancy as requested by user
      setParsedText('Guided Skill Generation');
      setSourceName('Skill Flow');
      setCurrentStep('questions');
    } else {
      setCurrentStep('input');
    }
  };

  const handleQuestionComplete = (completedAnswers: AgentQuestionAnswers) => {
    setAnswers(completedAnswers);
    handleGenerate(completedAnswers);
  };

  const handleGenerate = async (currentAnswers: AgentQuestionAnswers) => {
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
          outputType: outputType,
          targetPlatform: targetPlatform,
          parsedInput: parsedText,
          answers: currentAnswers,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate');
      }

      setGeneratedContent({
        content: result.data.content,
        entityName: result.data.entityName || 'AI Agent',
        generatedAt: result.data.generatedAt,
        outputType: outputType,
        skillOutput: result.data.skillOutput,
      });
      setCurrentStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;

    let filename: string;
    let content: string;

    if (generatedContent.outputType === 'skill' && generatedContent.skillOutput) {
      // For skills, download as zip (simplified for now - just the SKILL.md)
      filename = `${generatedContent.skillOutput.manifest.name}_SKILL.md`;
      content = generatedContent.skillOutput.skillMd;
    } else if (generatedContent.outputType === 'system-prompt') {
      filename = `${generatedContent.entityName.replace(/\s+/g, '_')}_system_prompt.txt`;
      content = generatedContent.content;
    } else {
      filename = `TELOS_${generatedContent.entityName.replace(/\s+/g, '_')}.md`;
      content = generatedContent.content;
    }

    const blob = new Blob([content], { type: 'text/plain' });
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
    setGeneratedContent(null);
    setCurrentStep('questions');
  };

  const handleSave = async (hostingType: HostingType, password?: string) => {
    if (!generatedContent) return;
    setIsSaving(true);

    try {
      const response = await fetch('/api/save-telos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'agent',
          entityName: generatedContent.entityName,
          outputType: outputType,
          targetPlatform: targetPlatform,
          rawInput: {
            source: sourceName,
            parsedText: parsedText,
            answers: answers,
          },
          generatedContent: generatedContent.content,
          skillMetadata: generatedContent.skillOutput?.manifest,
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

  // Get dynamic page title based on output type
  const getPageTitle = () => {
    if (outputType === 'telos') return 'Agent TELOS';
    if (outputType === 'system-prompt') return 'System Prompt Generator';
    if (outputType === 'skill') return 'Agent Skill Creator';
    return 'Agent Configuration';
  };

  // Get dynamic step 2 title based on output type
  const getInputStepTitle = () => {
    if (outputType === 'skill') return 'Step 2: Skill Context';
    if (outputType === 'system-prompt') return 'Step 2: Prompt Requirements';
    return 'Step 2: Agent Context';
  };

  const getInputStepDescription = () => {
    if (outputType === 'skill') return 'Provide details about the skill capability you want to build.';
    if (outputType === 'system-prompt') return 'Describe the role and goals for this system prompt.';
    return 'Provide the agent\'s system prompt or configuration file to extract its identity.';
  };

  // Render preview based on output type
  const renderPreview = () => {
    if (!generatedContent) return null;

    if (generatedContent.outputType === 'system-prompt') {
      return (
        <div className="space-y-6">
          <SystemPromptPreview
            content={generatedContent.content}
            targetPlatform={targetPlatform}
          />
          <div className="flex justify-between pt-4 border-t border-gray-700">
            <button
              onClick={handleBackToQuestions}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Edit
            </button>
            <button
              onClick={() => handleSave('open')}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save & Share'}
            </button>
          </div>
        </div>
      );
    }

    if (generatedContent.outputType === 'skill' && generatedContent.skillOutput) {
      return (
        <div className="space-y-6">
          <SkillPreview
            skillOutput={generatedContent.skillOutput}
            onDownload={handleDownload}
          />
          <div className="flex justify-between pt-4 border-t border-gray-700">
            <button
              onClick={handleBackToQuestions}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Edit
            </button>
            <button
              onClick={() => handleSave('open')}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save & Share'}
            </button>
          </div>
        </div>
      );
    }

    // Default TELOS preview
    return (
      <TELOSPreview
        content={generatedContent.content}
        entityName={generatedContent.entityName}
        onDownload={handleDownload}
        onBack={handleBackToQuestions}
        onSave={handleSave}
        isSaving={isSaving}
      />
    );
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-gray-400">
            {outputType === 'telos' && "Define an AI Agent's persona, constraints, and operating parameters."}
            {outputType === 'system-prompt' && "Generate a production-ready system prompt for your AI agent."}
            {outputType === 'skill' && "Create an installable skill package for Claude or Gemini agents."}
          </p>

          {/* Output type badge */}
          {currentStep !== 'output-type' && (
            <div className="mt-4 flex items-center gap-2">
              <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded-full">
                {OUTPUT_TYPE_INFO[outputType].icon} {OUTPUT_TYPE_INFO[outputType].label}
              </span>
              <span className="px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-full">
                {targetPlatform}
              </span>
              <button
                onClick={() => setCurrentStep('output-type')}
                className="text-xs text-gray-500 hover:text-gray-300 ml-2"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {currentStep === 'preview' ? (
          renderPreview()
        ) : (
          <div className="space-y-10">
            {/* Step 1: Output Type Selection */}
            {currentStep === 'output-type' && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8 space-y-8">
                <div className="border-b border-gray-800 pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-100">Step 1: Choose Output</h2>
                  <p className="text-gray-400 text-sm mt-1">What would you like to build today?</p>
                </div>

                <OutputTypeSelector
                  selectedType={outputType}
                  onSelect={setOutputType}
                />

                {outputType !== 'telos' && (
                  <PlatformSelector
                    selectedPlatform={targetPlatform}
                    onSelect={setTargetPlatform}
                  />
                )}

                <div className="flex justify-end pt-4 border-t border-gray-700">
                  <button
                    onClick={handleOutputTypeConfirm}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Continue to Context →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Input */}
            {currentStep === 'input' && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-100">
                      {getInputStepTitle()}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {getInputStepDescription()}
                    </p>
                  </div>
                </div>

                <AgentInputUpload onDataParsed={handleDataParsed} outputType={outputType} />
              </div>
            )}

            {/* Source summary (shown after input/during questions) */}
            {parsedText && currentStep === 'questions' && (
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
                  Start Over
                </button>
              </div>
            )}

            {/* Step 3: Questions */}
            {currentStep === 'questions' && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-100">
                      Step 3: Refine {OUTPUT_TYPE_INFO[outputType].label}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Refine the agent&apos;s behavior and constraints.
                    </p>
                  </div>
                </div>

                <QuestionFlow
                  questions={outputType === 'skill' ? skillQuestions : agentQuestions}
                  onComplete={handleQuestionComplete}
                  initialAnswers={answers}
                />
              </div>
            )}

            {isGenerating && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Generating {OUTPUT_TYPE_INFO[outputType].label}
                  </h3>
                  <p className="text-gray-400">
                    {outputType === 'skill' ? 'Creating skill package...' : 'Processing your configuration...'}
                  </p>
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