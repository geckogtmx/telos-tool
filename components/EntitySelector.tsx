'use client';

// Entity type selector component

import { useRouter } from 'next/navigation';
import Card from './ui/Card';
import { ENTITY_TYPES } from '@/config/constants';
import { EntityType } from '@/types';

export default function EntitySelector() {
  const router = useRouter();

  const handleSelectEntity = (entityType: EntityType) => {
    router.push(`/generate/${entityType}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Choose Your Entity Type
        </h1>
        <p className="text-lg text-gray-400">
          Select the type of TELOS you want to generate
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ENTITY_TYPES.map((entity) => (
          <Card
            key={entity.id}
            hover
            onClick={() => handleSelectEntity(entity.id)}
            className="p-6 relative overflow-hidden"
          >
            {entity.badge && (
              <div className="absolute top-0 right-0">
                <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                  {entity.badge}
                </div>
              </div>
            )}
            <div className="text-center h-full flex flex-col">
              <div className="text-5xl mb-4">{entity.icon}</div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                {entity.name}
              </h3>
              <p className="text-gray-400 mb-4 text-sm flex-grow">
                {entity.description}
              </p>
              <div className="text-xs text-gray-500 border-t border-gray-700 pt-4 mt-auto">
                <span className="block font-semibold mb-1">Input:</span> 
                {entity.inputType}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
