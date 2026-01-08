'use client';

import { useState } from 'react';

type OrgInputUploadProps = {
  onDataParsed: (text: string, source: string) => void;
};

export default function OrgInputUpload({ onDataParsed }: OrgInputUploadProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('text');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, we would call an API endpoint to fetch the URL
      // For now, we will simulate it or implement a basic fetch if CORS allows (unlikely)
      // or use a server-side proxy.
      // Let's assume we have an API endpoint /api/parse-url (not implemented yet).
      // For this build, we might need to rely on Paste Text mostly.
      
      // Let's implement a basic fetch to our own API which we will create shortly?
      // Or just tell user to paste text.
      // Spec says "Fetch and parse".
      
      // Let's try to fetch via a new API route /api/parse-url. 
      // I will create that route next.
      const response = await fetch('/api/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to fetch URL');
      
      onDataParsed(result.text, url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    // Basic validation
    if (text.length < 50) {
      setError('Please provide more detailed information (at least 50 characters).');
      return;
    }
    
    onDataParsed(text, 'Manual Text Entry');
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
          Paste Text
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'url' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('url')}
        >
          Import from URL
        </button>
      </div>

      {activeTab === 'text' ? (
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <div>
            <label htmlFor="orgText" className="block text-sm font-medium text-gray-300 mb-2">
              Paste About Page / Organization Info
            </label>
            <textarea
              id="orgText"
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste the content of your About page, Mission Statement, or Company History here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Use This Content
          </button>
        </form>
      ) : (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div>
            <label htmlFor="orgUrl" className="block text-sm font-medium text-gray-300 mb-2">
              About Page URL
            </label>
            <input
              id="orgUrl"
              type="url"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/about"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2">
              Note: Some websites may block automated access. If this fails, please copy and paste the text instead.
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Fetching...' : 'Import Content'}
          </button>
        </form>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
