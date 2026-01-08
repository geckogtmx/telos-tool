'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IndividualFullPage() {
  const [upgradeData, setUpgradeData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem('telos_upgrade_data');
    if (data) {
      setUpgradeData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Full Individual TELOS</h1>
        <p className="text-gray-400 mb-6">
          This feature (Phase 13) is under construction.
        </p>
        
        {upgradeData ? (
          <div className="bg-green-900/30 border border-green-800 rounded-md p-4 mb-6">
            <p className="text-green-400 font-medium text-sm">
              ✓ Upgrade data received
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {Object.keys(upgradeData.answers || {}).length} answers carried over from Quick TELOS.
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-md p-4 mb-6">
            <p className="text-gray-400 text-sm">
              Starting fresh (no upgrade data found).
            </p>
          </div>
        )}

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
