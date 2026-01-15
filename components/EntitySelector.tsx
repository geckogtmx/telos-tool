'use client';

// Entity type selector component with output type indicators

import { useRouter } from 'next/navigation';
import Card from './ui/Card';
import { ENTITY_TYPES } from '@/config/constants';
import { EntityType } from '@/types';

// Output type styling
const OUTPUT_TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  'telos': { bg: 'bg-gray-700', text: 'text-gray-300', label: 'TELOS' },
  'system-prompt': { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Prompt' },
  'skill': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Skill' },
};

export default function EntitySelector() {
  const router = useRouter();

  const handleSelectEntity = (entityType: EntityType) => {
    router.push(`/generate/${entityType}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          What do you want to create?
        </h1>
        <p className="text-lg text-gray-400">
          Choose an entity type to get started
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {ENTITY_TYPES.map((entity) => (
          <Card
            key={entity.id}
            hover
            onClick={() => handleSelectEntity(entity.id)}
            className={`p-6 relative overflow-hidden h-full ${entity.id === 'agent' ? 'border-blue-500/50' : ''
              }`}
          >
            {/* Badge */}
            {entity.badge && (
              <div className="absolute top-0 right-0">
                <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                  {entity.badge}
                </div>
              </div>
            )}

            <div className="text-center h-full flex flex-col">
              {/* Icon */}
              <div className="text-5xl mb-4">{entity.icon}</div>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                {entity.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-4 text-sm flex-grow">
                {entity.description}
              </p>

              {/* Output types */}
              {entity.outputTypes && entity.outputTypes.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {entity.outputTypes.map((outputType) => {
                    const style = OUTPUT_TYPE_STYLES[outputType];
                    return (
                      <span
                        key={outputType}
                        className={`px-2 py-1 ${style.bg} ${style.text} text-xs rounded font-medium`}
                      >
                        {style.label}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Input type */}
              <div className="text-xs text-gray-500 border-t border-gray-700 pt-4 mt-auto">
                <span className="block font-semibold mb-1">Input:</span>
                {entity.inputType}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Hint for Agent */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          💡 <span className="text-gray-400">Tip:</span> Select <strong className="text-blue-400">AI Agent</strong> to create system prompts or installable skills
        </p>
      </div>
    </div>
  );
}
