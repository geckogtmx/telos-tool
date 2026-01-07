'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  entityType?: 'individual' | 'organization' | 'agent';
}

export default function FileUpload({
  onFileSelect,
  acceptedFileTypes = ['.pdf', '.docx', '.txt'],
  maxSize = 5 * 1024 * 1024, // 5MB default
  entityType = 'individual'
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const getPlaceholderText = () => {
    switch (entityType) {
      case 'individual':
        return 'Upload your CV (.pdf, .docx, or .txt)';
      case 'organization':
        return 'Upload about page or description (.txt)';
      case 'agent':
        return 'Upload system prompt or config (.txt)';
      default:
        return 'Upload file';
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File must be under ${maxSize / (1024 * 1024)}MB`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError(`Please upload a ${acceptedFileTypes.join(', ')} file`);
      } else {
        setError('Invalid file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, acceptedFileTypes, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      if (type === '.pdf') acc['application/pdf'] = ['.pdf'];
      if (type === '.docx') acc['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
      if (type === '.txt') acc['text/plain'] = ['.txt'];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: false
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive
            ? 'border-blue-500 bg-blue-950'
            : 'border-gray-700 hover:border-gray-600 bg-gray-900'
          }
          ${error ? 'border-red-500 bg-red-950' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          <svg
            className={`w-12 h-12 ${isDragActive ? 'text-blue-400' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div>
            <p className="text-lg font-medium text-gray-200">
              {isDragActive ? 'Drop file here' : getPlaceholderText()}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              or click to browse
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Max file size: {maxSize / (1024 * 1024)}MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-950 border border-red-800 rounded-md">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
