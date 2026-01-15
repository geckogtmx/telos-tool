'use client';

import { OUTPUT_TYPES } from '@/config/constants';
import { OutputType } from '@/types/output-types';

interface OutputTypeSelectorProps {
    selectedType: OutputType;
    onSelect: (type: OutputType) => void;
    disabled?: boolean;
}

export function OutputTypeSelector({
    selectedType,
    onSelect,
    disabled = false,
}: OutputTypeSelectorProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Select Output Type</h2>
            <p className="text-gray-400">
                Choose what you want to generate from your agent configuration.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {OUTPUT_TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onSelect(type.id)}
                        disabled={disabled}
                        className={`
              relative p-6 rounded-xl border-2 transition-all duration-200
              text-left group
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
              ${selectedType === type.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                            }
            `}
                    >
                        {/* Selection indicator */}
                        {selectedType === type.id && (
                            <div className="absolute top-3 right-3">
                                <svg
                                    className="w-6 h-6 text-blue-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        )}

                        {/* Icon */}
                        <div className="text-4xl mb-3">{type.icon}</div>

                        {/* Label */}
                        <h3 className="text-lg font-semibold text-white mb-1">
                            {type.label}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-400">{type.description}</p>

                        {/* Badge for new features */}
                        {type.id !== 'telos' && (
                            <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                                New
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
