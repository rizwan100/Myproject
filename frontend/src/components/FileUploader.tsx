"use client";

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes: string;
  maxSize: number; // in bytes
  label: string;
  className?: string;
}

export default function FileUploader({
  onFileSelect,
  acceptedTypes,
  maxSize,
  label,
  className,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const fileTypeIsValid = acceptedTypes
      .split(',')
      .some(type => selectedFile.name.toLowerCase().endsWith(type.trim()));

    if (!fileTypeIsValid) {
        setError(`Invalid file type. Accepted types: ${acceptedTypes}`);
        setFile(null);
        onFileSelect(null);
        return;
    }

    if (selectedFile.size > maxSize) {
      setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB.`);
      setFile(null);
      onFileSelect(null);
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      <div className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-gray-300 hover:border-gray-400" onClick={() => inputRef.current?.click()}>
        <Input ref={inputRef} type="file" className="hidden" accept={acceptedTypes} onChange={handleFileChange} />
        {file ? (
          <div className="text-center">
            <FileIcon className="mx-auto h-12 w-12 text-gray-500" />
            <p className="mt-2 text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            <Button type="button" variant="ghost" size="sm" className="mt-2 text-red-600 hover:text-red-700" onClick={(e) => { e.stopPropagation(); removeFile(); }}> <X className="h-4 w-4 mr-1" /> Remove </Button>
          </div>
        ) : (
          <div className="text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600"> <span className="font-semibold text-rose-600">Click to upload</span> or drag and drop </p>
            <p className="text-xs text-gray-500 mt-1">Max file size: {maxSize / 1024 / 1024}MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}