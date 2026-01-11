'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';

type AgentInputUploadProps = {
  onDataParsed: (text: string, source: string) => void;
};

export default function AgentInputUpload({ onDataParsed }: AgentInputUploadProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (text.length < 20) {
      setError('Please provide more detailed information (at least 20 characters).');
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
          Paste System Prompt
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'file'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-200'
            }`}
          onClick={() => setActiveTab('file')}
        >
          Upload Config
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
              Paste Agent System Prompt / Instructions
            </label>
            <textarea
              id="agentText"
              rows={12}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="You are a helpful assistant..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Analyze Prompt
          </button>
        </form>
      )}

      {!isLoading && activeTab === 'file' && (
        <div>
          <p className="text-sm text-gray-400 mb-4">
            Upload an agent configuration, system prompt file, or documentation (TXT, MD, PDF).
          </p>
          <FileUpload
            onFileSelect={handleFileSelect}
            entityType="agent"
            acceptedFileTypes={['.txt', '.md', '.pdf', '.docx']}
          />
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
