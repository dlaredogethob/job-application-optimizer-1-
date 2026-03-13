import React, { useRef, useState } from 'react';
import { Icons } from './ui/icons';
import { UploadedFile } from '../types';
import { mockParseFile } from '../services/storageService';

interface FileUploaderProps {
  onFileUpload: (file: UploadedFile) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      let type: UploadedFile['type'] = 'other';
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes('resume') || lowerName.includes('cv')) type = 'resume';
      else if (lowerName.includes('job') || lowerName.includes('description') || lowerName.includes('jd')) type = 'job_description';
      else if (lowerName.includes('company')) type = 'company_info';

      const newFile: UploadedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        type,
        size: file.size,
        uploadDate: Date.now(),
        contentSnippet: mockParseFile(file)
      };

      onFileUpload(newFile);
      setUploading(false);
      setDragActive(false);
    }, 800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
        <Icons.Sidebar.Upload className="w-4 h-4 text-slate-900" width={16} height={16} /> Upload Materials
      </h3>

      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-in-out cursor-pointer
          ${dragActive ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02]' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50 hover:shadow-sm'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.txt"
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs text-indigo-600 font-medium">Analyzing file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center pointer-events-none">
            <div className="p-3 bg-white text-slate-700 rounded-2xl mb-3 border border-slate-200 shadow-sm transition-transform group-hover:scale-110">
              <Icons.Library.DocumentAdd className="w-6 h-6 text-emerald-600" width={24} height={24} />
            </div>
            <p className="text-sm font-medium text-slate-700">Click or Drag File</p>
            <p className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
