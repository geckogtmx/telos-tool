'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';

type OrgInputUploadProps = {
  onDataParsed: (text: string, source: string) => void;
};

export default function OrgInputUpload({ onDataParsed }: OrgInputUploadProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);

  // URL handling removed per Phase 16.5 requirement

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (text.length < 50) {
      setError('Please provide more detailed information (at least 50 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/parse-org', {
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

      const response = await fetch('/api/parse-org', {
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
          Paste Text
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'file'
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-gray-400 hover:text-gray-200'
            }`}
          onClick={() => setActiveTab('file')}
        >
          Upload File
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
            <label htmlFor="orgText" className="block text-sm font-medium text-gray-300 mb-2">
              Paste About Page / Organization Info
            </label>
            <textarea
              id="orgText"
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Paste the content of your About page, Mission Statement, or Company History here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowExample(!showExample)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${showExample ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                {showExample ? 'Hide Example' : 'Need an example?'}
              </button>

              {showExample && (
                <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-md text-xs text-gray-400 font-mono whitespace-pre-wrap leading-relaxed">
                  {`Acme Corp is a B2B SaaS platform founded in 2020.
Mission: To democratize supply chain efficiency for small businesses.
Values:
1. Speed over perfection: We ship daily.
2. Honest pricing: No hidden fees, ever.
3. Users first: We build what you vote for.

We currently serve 5,000+ customers in retail and e-commerce.
Key operational principle: Distributed ownership—everyone is a project lead.
Current Goals: Launch mobile app by Q4, reduce support response time to <1hr.`}
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Use This Content
          </button>
        </form>
      )}

      {!isLoading && activeTab === 'file' && (
        <div>
          <p className="text-sm text-gray-400 mb-4">
            Upload a company profile, About Us PDF, or pitch deck (TXT, PDF, DOCX).
          </p>
          <FileUpload
            onFileSelect={handleFileSelect}
            entityType="organization"
            acceptedFileTypes={['.txt', '.pdf', '.docx']}
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
