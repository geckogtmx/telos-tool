'use client';

import { useState } from 'react';
import { TargetPlatform, PLATFORM_HINTS } from '@/types/output-types';

interface SystemPromptPreviewProps {
    content: string;
    targetPlatform: TargetPlatform;
    onCopy?: () => void;
}

export function SystemPromptPreview({
    content,
    targetPlatform,
    onCopy,
}: SystemPromptPreviewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            onCopy?.();
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">System Prompt</h2>
                    <p className="text-sm text-gray-400">
                        Optimized for {PLATFORM_HINTS[targetPlatform].label}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Platform badge */}
                    <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded-full">
                        {PLATFORM_HINTS[targetPlatform].label}
                    </span>

                    {/* Copy button */}
                    <button
                        onClick={handleCopy}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${copied
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }
            `}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy to Clipboard
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Content preview */}
            <div className="relative">
                <pre className="p-4 bg-gray-900 rounded-lg border border-gray-700 overflow-x-auto text-sm text-gray-300 whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                    {content}
                </pre>

                {/* Fade overlay for long content */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
            </div>

            {/* Usage instructions */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-sm font-semibold text-white mb-2">How to use</h3>
                <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Copy the system prompt above</li>
                    <li>Paste it into your AI application&apos;s system prompt field</li>
                    <li>Start a new conversation to apply the prompt</li>
                </ol>
            </div>
        </div>
    );
}
