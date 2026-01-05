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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Entity Type
        </h1>
        <p className="text-lg text-gray-600">
          Select the type of TELOS you want to generate
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {ENTITY_TYPES.map((entity) => (
          <Card
            key={entity.id}
            hover
            onClick={() => handleSelectEntity(entity.id)}
            className="p-8"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{entity.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {entity.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {entity.description}
              </p>
              <div className="text-sm text-gray-500 border-t pt-4">
                <strong>Input:</strong> {entity.inputType}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
