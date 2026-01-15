'use client';

import { PLATFORMS } from '@/config/constants';
import { TargetPlatform, PLATFORM_HINTS } from '@/types/output-types';

interface PlatformSelectorProps {
    selectedPlatform: TargetPlatform;
    onSelect: (platform: TargetPlatform) => void;
    disabled?: boolean;
}

// Platform icons mapping
const PLATFORM_ICONS: Record<TargetPlatform, string> = {
    universal: '🌐',
    claude: '🟡',
    gemini: '🔵',
    openai: '🟢',
    cursor: '⬛',
    windsurf: '🌊',
};

export function PlatformSelector({
    selectedPlatform,
    onSelect,
    disabled = false,
}: PlatformSelectorProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Target Platform</h2>
            <p className="text-gray-400">
                Optimize the output for a specific AI platform or keep it universal.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {PLATFORMS.map((platform) => (
                    <button
                        key={platform.id}
                        onClick={() => onSelect(platform.id)}
                        disabled={disabled}
                        className={`
              relative p-4 rounded-lg border-2 transition-all duration-200
              text-center group
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
              ${selectedPlatform === platform.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                            }
            `}
                    >
                        {/* Icon */}
                        <div className="text-2xl mb-2">{PLATFORM_ICONS[platform.id]}</div>

                        {/* Label */}
                        <h3 className="text-sm font-semibold text-white">
                            {platform.label}
                        </h3>

                        {/* Selection check */}
                        {selectedPlatform === platform.id && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Platform hint */}
            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-400">
                    <span className="text-white font-medium">
                        {PLATFORM_HINTS[selectedPlatform].label}:
                    </span>{' '}
                    {PLATFORM_HINTS[selectedPlatform].formatTip}
                </p>
            </div>
        </div>
    );
}
