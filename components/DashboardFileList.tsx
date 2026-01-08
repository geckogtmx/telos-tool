'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { TELOSData } from '@/types';
import DashboardFileCard from './DashboardFileCard';

type EntityTypeFilter = 'all' | 'individual' | 'organization' | 'agent';

export default function DashboardFileList({ userId }: { userId: string }) {
  const [files, setFiles] = useState<TELOSData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<EntityTypeFilter>('all');
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('telos_files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform snake_case DB fields to camelCase TS types
      const formattedFiles: TELOSData[] = (data || []).map(item => ({
        id: item.id, // Ensure id is passed if available in DB types
        entityType: item.entity_type,
        entityName: item.entity_name,
        rawInput: item.raw_input,
        generatedContent: item.generated_content,
        publicId: item.public_id,
        hostingType: item.hosting_type,
        version: item.version,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      setFiles(formattedFiles);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load your files.');
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('telos_files')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from state
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete file.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredFiles = files.filter(f => 
    filter === 'all' ? true : f.entityType === filter
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-900 text-red-200 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'individual', 'organization', 'agent'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize whitespace-nowrap ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            {type === 'all' ? 'All Files' : type}
          </button>
        ))}
      </div>

      {/* List */}
      {files.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-lg border-dashed">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No TELOS files yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Create your first TELOS file to define your mission, values, and operating principles.
          </p>
          <Link href="/generate" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
             Start Generating
          </Link>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No {filter} files found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map(file => (
            <DashboardFileCard
              key={file.id as string}
              file={file}
              onDelete={handleDelete}
              isDeleting={deletingId === file.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
