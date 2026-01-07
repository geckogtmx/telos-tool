'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { TELOSData } from '@/types';
import Button from './ui/Button';

type DashboardFileCardProps = {
  file: TELOSData;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export default function DashboardFileCard({ file, onDelete, isDeleting }: DashboardFileCardProps) {
  const isHosted = file.hostingType !== 'private';
  const hostedUrl = `/t/${file.publicId}`;
  
  // Format dates safely
  const createdDate = new Date(file.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${hostedUrl}`;
    navigator.clipboard.writeText(url);
    // Could add a toast here
    alert('Link copied to clipboard!');
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-500 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize border ${
          file.entityType === 'individual' ? 'bg-blue-900/30 border-blue-800 text-blue-300' :
          file.entityType === 'organization' ? 'bg-purple-900/30 border-purple-800 text-purple-300' :
          'bg-green-900/30 border-green-800 text-green-300'
        }`}>
          {file.entityType}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border ${
          file.hostingType === 'open' ? 'text-green-400 bg-green-400/10 border-green-900/50' :
          file.hostingType === 'encrypted' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-900/50' :
          'text-gray-400 bg-gray-400/10 border-gray-800'
        }`}>
          {file.hostingType === 'open' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          )}
          {file.hostingType === 'encrypted' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          )}
          {file.hostingType === 'private' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
          )}
          {file.hostingType.charAt(0).toUpperCase() + file.hostingType.slice(1)}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-100 mb-1">{file.entityName}</h3>
        <p className="text-sm text-gray-400">Created {timeAgo}</p>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-800">
        <Link href={`/t/${file.publicId}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            View
          </Button>
        </Link>

        <Link href={`/generate/${file.entityType}?id=${file.id}`}>
          <Button variant="outline" size="sm" title="Edit TELOS">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </Button>
        </Link>
        
        {isHosted && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyLink}
            title="Copy Public Link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          </Button>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-400 border-red-900 hover:bg-red-950 hover:text-red-300"
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${file.entityName}? This cannot be undone.`)) {
                onDelete(file.id as string); // Cast because id is technically optional in type but present in DB
            }
          }}
          disabled={isDeleting}
        >
          {isDeleting ? (
             <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          )}
        </Button>
      </div>
    </div>
  );
}
