'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { OutputType } from '@/types/output-types';

type AgentInputUploadProps = {
  onDataParsed: (text: string, source: string) => void;
  outputType?: OutputType;
};

export default function AgentInputUpload({ onDataParsed, outputType = 'telos' }: AgentInputUploadProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'guided'>('text');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic copy based on output type
  const getLabels = () => {
    switch (outputType) {
      case 'skill':
        return {
          textTab: 'Paste Description',
          fileTab: 'Upload Docs',
          textLabel: 'Describe the skill you want to create',
          textPlaceholder: 'I want an agent skill that can access the weather API and report the forecast...',
          fileHelp: 'Upload API documentation, requirements, or existing scripts.',
          guidedTitle: 'New to Skills?',
          guidedText: 'We\'ll ask you simple questions to define what your skill should do.',
          examples: [
            { label: 'Weather Skill', text: 'Create a skill that fetches current weather for a specific city using the OpenWeatherMap API. It should take a city name as input and return a formatted string with temperature and conditions.' },
            { label: 'PDF Summarizer', text: 'I need a skill that takes a PDF URL, downloads it, extracts the text, and returns a 3-sentence summary of the content.' },
            { label: 'Currency Converter', text: 'A tool that converts between USD, EUR, and GBP using real-time exchange rates. It should handle amount and target currency as inputs.' }
          ]
        };
      case 'system-prompt':
        return {
          textTab: 'Paste Requirements',
          fileTab: 'Upload Context',
          textLabel: 'What should this agent do?',
          textPlaceholder: 'You are a customer support agent for a tech company...',
          fileHelp: 'Upload product manuals, style guides, or existing reference prompts.',
          guidedTitle: 'Start from Scratch',
          guidedText: 'We\'ll help you define the perfect persona and constraints for your agent.',
          examples: [
            { label: 'Coding Assistant', text: 'You are an expert Python developer specialized in Data Science. You prefer clear, concise code with type hints. You always explain your logic step-by-step.' },
            { label: 'Support Agent', text: 'You are a friendly customer support agent for a SaaS platform. You assume users are non-technical and explain concepts simply. You never blame the user.' },
            { label: 'Creative Writer', text: 'You are a gritty noir detective novelist. Your style is dark, atmospheric, and cynical. You use short sentences and vivid metaphors.' }
          ]
        };
      default: // telos
        return {
          textTab: 'Paste Instructions',
          fileTab: 'Upload Config',
          textLabel: 'Paste Agent System Prompt / Instructions',
          textPlaceholder: 'You are a helpful assistant...',
          fileHelp: 'Upload an agent configuration, system prompt file, or documentation (TXT, MD, PDF).',
          guidedTitle: 'No System Prompt? No Problem.',
          guidedText: 'We\'ll interview you to define your agent\'s personality, constraints, and capabilities from the ground up.',
          examples: [
            { label: 'Career Coach', text: 'You are an empathetic career coach helping junior developers find their first role. You focus on resume reviews and interview prep.' },
            { label: 'Marketing Manager', text: 'You are a senior marketing strategist. You focus on brand positioning, high-level campaigns, and ROI analysis. You are bold and data-driven.' },
            { label: 'D&D Dungeon Master', text: 'You are a Dungeon Master running a D&D 5e campaign in a high-fantasy setting. You are descriptive, fair, and immersive.' }
          ]
        };
    }
  };

  const labels = getLabels();

  const handleGuidedStart = () => {
    onDataParsed('No initial input provided. The user is defining this agent from scratch based on the interview questions below.', 'Guided Creation Mode');
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (text.length < 10) {
      setError('Please provide a bit more detail (at least 10 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/parse-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      onDataParsed(result.data.text, 'Manual Text Entry');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse text');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-agent', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      onDataParsed(result.data.text, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-700">
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'text'
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-gray-400 hover:text-gray-200'
            }`}
          onClick={() => setActiveTab('text')}
        >
          {labels.textTab}
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'file'
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-gray-400 hover:text-gray-200'
            }`}
          onClick={() => setActiveTab('file')}
        >
          {labels.fileTab}
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'guided'
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-gray-400 hover:text-gray-200'
            }`}
          onClick={() => setActiveTab('guided')}
        >
          Start from Scratch
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!isLoading && activeTab === 'text' && (
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <div>
            <label htmlFor="agentText" className="block text-sm font-medium text-gray-300 mb-2">
              {labels.textLabel}
            </label>
            <textarea
              id="agentText"
              rows={12}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder={labels.textPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Examples Chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-gray-500 py-1">Try an example:</span>
              {labels.examples.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setText(ex.text)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-blue-400 border border-gray-700 rounded-full px-3 py-1 transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {outputType === 'skill' ? 'Create Skill Base' : 'Analyze Prompt'}
          </button>
        </form>
      )}

      {!isLoading && activeTab === 'file' && (
        <div>
          <p className="text-sm text-gray-400 mb-4">
            {labels.fileHelp}
          </p>
          <FileUpload
            onFileSelect={handleFileSelect}
            entityType="agent"
            acceptedFileTypes={['.txt', '.md', '.pdf', '.docx']}
          />
        </div>
      )}

      {!isLoading && activeTab === 'guided' && (
        <div className="text-center py-8">
          <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-200 mb-2">{labels.guidedTitle}</h3>
            <p className="text-gray-400 max-w-lg mx-auto">
              {labels.guidedText}
            </p>
          </div>
          <button
            onClick={handleGuidedStart}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-blue-900/20"
          >
            Start Guided Mode
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
