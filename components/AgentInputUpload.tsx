'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';

type AgentInputUploadProps = {
  onDataParsed: (text: string, source: string) => void;
};

export default function AgentInputUpload({ onDataParsed }: AgentInputUploadProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('text');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    if (text.length < 20) {
      setError('Please provide more detailed information (at least 20 characters).');
      return;
    }
    
    onDataParsed(text, 'Manual System Prompt Entry');
  };

  const handleFileSelect = async (file: File) => {
    // For agents, we can use the same parse-cv endpoint to extract text
    // even though we don't need PII scrubbing, it handles text extraction nicely.
    // Ideally we'd have a generic /api/extract-text endpoint.
    // For now, let's reuse parse-cv but we ignore the PII warnings.
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse file');
      }

      onDataParsed(result.data.text, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-700">
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'text' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('text')}
        >
          Paste System Prompt
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'upload' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          Upload File
        </button>
      </div>

      {activeTab === 'text' ? (
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <div>
            <label htmlFor="agentText" className="block text-sm font-medium text-gray-300 mb-2">
              Paste System Prompt
            </label>
            <textarea
              id="agentText"
              rows={12}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="You are an AI agent designed to..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Use This Prompt
          </button>
        </form>
      ) : (
        <div>
           <label className="block text-sm font-medium text-gray-300 mb-4">
              Upload System Prompt or Config File (.txt, .md, .json)
            </label>
            <FileUpload 
                onFileSelect={handleFileSelect} 
                entityType="agent"
                acceptedFileTypes={['.txt', '.md', '.json', '.pdf', '.docx']}
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
