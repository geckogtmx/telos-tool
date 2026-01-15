'use client';

import { useState } from 'react';
import { SkillOutput } from '@/types/output-types';

interface SkillPreviewProps {
    skillOutput: SkillOutput;
    onDownload?: () => void;
}

export function SkillPreview({ skillOutput, onDownload }: SkillPreviewProps) {
    const [activeTab, setActiveTab] = useState<'skill' | 'structure' | 'scripts'>('skill');
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(skillOutput.skillMd);
            setCopied(true);
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
                    <h2 className="text-xl font-semibold text-white">
                        Skill: {skillOutput.manifest.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {skillOutput.manifest.description}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Platform badge */}
                    <span className="px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-full">
                        {skillOutput.manifest.targetPlatform}
                    </span>

                    {/* Download button */}
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download .zip
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('skill')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'skill'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    SKILL.md
                </button>
                <button
                    onClick={() => setActiveTab('structure')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'structure'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Folder Structure
                </button>
                {skillOutput.scripts.length > 0 && (
                    <button
                        onClick={() => setActiveTab('scripts')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'scripts'
                                ? 'text-blue-400 border-b-2 border-blue-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Scripts ({skillOutput.scripts.length})
                    </button>
                )}

                {/* Copy button aligned right */}
                <div className="ml-auto flex items-center">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tab content */}
            <div className="relative">
                {activeTab === 'skill' && (
                    <pre className="p-4 bg-gray-900 rounded-lg border border-gray-700 overflow-x-auto text-sm text-gray-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                        {skillOutput.skillMd}
                    </pre>
                )}

                {activeTab === 'structure' && (
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                        <pre className="text-sm text-gray-300 font-mono">
                            {`${skillOutput.manifest.name}/
├── SKILL.md
${skillOutput.scripts.map(s => `└── scripts/
    └── ${s.filename}`).join('\n')}`}
                        </pre>
                    </div>
                )}

                {activeTab === 'scripts' && skillOutput.scripts.length > 0 && (
                    <div className="space-y-4">
                        {skillOutput.scripts.map((script, idx) => (
                            <div key={idx} className="bg-gray-900 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                                    <span className="text-sm font-medium text-white">
                                        {script.filename}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {script.isCustom ? 'Custom' : 'AI Generated'} • {script.language}
                                    </span>
                                </div>
                                <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                                    {script.content}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Installation instructions */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-sm font-semibold text-white mb-2">Installation</h3>
                <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Download the skill package (.zip)</li>
                    <li>Extract to your project&apos;s <code className="text-blue-400">skills/</code> directory</li>
                    <li>The agent will automatically discover and use the skill</li>
                </ol>
            </div>
        </div>
    );
}
