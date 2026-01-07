'use client';

import React, { useState, useMemo } from 'react';
import HostingOptions from './HostingOptions';
import { HostingType } from '@/types';

type TELOSPreviewProps = {
  content: string;
  entityName: string;
  onDownload: () => void;
  onBack?: () => void;
  onSave?: (hostingType: HostingType, password?: string) => Promise<void>;
  isSaving?: boolean;
};

type Section = {
  id: string;
  title: string;
  level: number;
};

export default function TELOSPreview({
  content,
  entityName,
  onDownload,
  onBack,
  onSave,
  isSaving = false,
}: TELOSPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [showToc, setShowToc] = useState(true);

  // Extract sections for table of contents
  const sections = useMemo((): Section[] => {
    const result: Section[] = [];
    const lines = content.split('\n');

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '');
        result.push({
          id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title,
          level: 2,
        });
      } else if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '');
        result.push({
          id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title,
          level: 3,
        });
      }
    });

    return result;
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TELOS - ${entityName}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              color: #1a1a1a;
            }
            h1 { font-size: 28px; margin-top: 32px; margin-bottom: 16px; }
            h2 { font-size: 22px; margin-top: 28px; margin-bottom: 12px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
            h3 { font-size: 18px; margin-top: 20px; margin-bottom: 8px; }
            p { margin-bottom: 12px; }
            ul, ol { margin-bottom: 16px; padding-left: 24px; }
            li { margin-bottom: 4px; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
            blockquote { border-left: 4px solid #e5e5e5; margin: 16px 0; padding-left: 16px; color: #666; }
            hr { border: none; border-top: 1px solid #e5e5e5; margin: 24px 0; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>TELOS - ${entityName}</h1>
          ${content
            .split('\n')
            .map(line => {
              const trimmed = line.trim();
              if (trimmed.startsWith('## ')) return `<h2>${trimmed.slice(3)}</h2>`;
              if (trimmed.startsWith('### ')) return `<h3>${trimmed.slice(4)}</h3>`;
              if (trimmed.startsWith('# ')) return `<h1>${trimmed.slice(2)}</h1>`;
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return `<li>${trimmed.slice(2)}</li>`;
              if (trimmed.startsWith('> ')) return `<blockquote>${trimmed.slice(2)}</blockquote>`;
              if (trimmed === '---') return '<hr>';
              if (trimmed === '') return '';
              return `<p>${trimmed}</p>`;
            })
            .join('\n')}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Enhanced markdown rendering
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.JSX.Element[] = [];
    let listItems: string[] = [];
    let listKey = 0;
    let inBlockquote = false;
    let blockquoteLines: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-1 mb-4 text-gray-300 ml-2">
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushBlockquote = () => {
      if (blockquoteLines.length > 0) {
        elements.push(
          <blockquote key={`blockquote-${listKey++}`} className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-800/50 rounded-r">
            {blockquoteLines.map((line, i) => (
              <p key={i} className="text-gray-400 italic" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
            ))}
          </blockquote>
        );
        blockquoteLines = [];
        inBlockquote = false;
      }
    };

    const formatInlineMarkdown = (text: string): string => {
      // Bold
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-100 font-semibold">$1</strong>');
      // Italic
      text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
      // Code
      text = text.replace(/`(.+?)`/g, '<code class="bg-gray-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
      // Links
      text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');
      return text;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Horizontal rule
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        flushList();
        flushBlockquote();
        elements.push(
          <hr key={index} className="border-gray-700 my-6" />
        );
        return;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        flushList();
        blockquoteLines.push(trimmed.substring(2));
        inBlockquote = true;
        return;
      } else if (inBlockquote && trimmed !== '') {
        flushBlockquote();
      }

      // Headers with IDs for navigation
      if (trimmed.startsWith('## ')) {
        flushList();
        flushBlockquote();
        const title = trimmed.replace('## ', '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h2 key={index} id={id} className="text-xl font-bold text-gray-100 mt-8 mb-3 pb-2 border-b border-gray-700 scroll-mt-4">
            {title}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        flushBlockquote();
        const title = trimmed.replace('### ', '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h3 key={index} id={id} className="text-lg font-semibold text-gray-200 mt-5 mb-2 scroll-mt-4">
            {title}
          </h3>
        );
      } else if (trimmed.startsWith('# ')) {
        flushList();
        flushBlockquote();
        elements.push(
          <h1 key={index} className="text-2xl font-bold text-gray-100 mt-6 mb-4">
            {trimmed.replace('# ', '')}
          </h1>
        );
      }
      // List items
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushBlockquote();
        listItems.push(trimmed.substring(2));
      }
      // Numbered list items
      else if (/^\d+\.\s/.test(trimmed)) {
        flushBlockquote();
        const itemContent = trimmed.replace(/^\d+\.\s/, '');
        listItems.push(itemContent);
      }
      // Empty lines
      else if (trimmed === '') {
        flushList();
        flushBlockquote();
      }
      // Regular paragraphs
      else {
        flushList();
        flushBlockquote();
        elements.push(
          <p
            key={index}
            className="text-gray-300 mb-3 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
          />
        );
      }
    });

    flushList();
    flushBlockquote();
    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-100">
              TELOS Generated Successfully
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {entityName}&apos;s TELOS file is ready
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              Edit Answers
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onDownload}
            className="flex-1 min-w-[140px] bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download .md
          </button>
          <button
            onClick={handleCopy}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* View toggle and TOC toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'raw'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Raw Markdown
          </button>
        </div>

        {viewMode === 'preview' && sections.length > 0 && (
          <button
            onClick={() => setShowToc(!showToc)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            {showToc ? 'Hide' : 'Show'} Contents
          </button>
        )}
      </div>

      {/* Table of Contents */}
      {viewMode === 'preview' && showToc && sections.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Contents
          </h3>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`block w-full text-left text-sm transition-colors hover:text-blue-400 ${
                  section.level === 2 ? 'text-gray-300 font-medium' : 'text-gray-500 pl-4'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* TELOS Content */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        {viewMode === 'preview' ? (
          <div className="prose prose-invert max-w-none">
            {renderMarkdown(content)}
          </div>
        ) : (
          <div className="relative">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
              {content}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Hosting Options */}
      {onSave && (
        <HostingOptions onSave={onSave} isSaving={isSaving} />
      )}
    </div>
  );
}
