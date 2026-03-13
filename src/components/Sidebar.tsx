import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, UploadedFile } from '../types';
import FileUploader from './FileUploader';
import ProjectList from './ProjectList';
import { Icons } from './ui/icons';
import { toast } from 'react-hot-toast';

interface SidebarProps {
  currentProject: Project;
  projects: Project[];
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
  onFileUpload: (file: UploadedFile) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onDeleteProject,
  onNewProject,
  onFileUpload,
  isOpen,
  setIsOpen
}) => {

  const handleFileClick = (file: UploadedFile) => {
    if (!file.contentSnippet || file.contentSnippet.trim().length === 0) {
      toast(
        `⚠️ No content could be extracted from "${file.name}". Only PDF, TXT, and MD files are supported. DOCX files cannot be read directly — please convert to PDF first.`,
        {
          duration: 6000,
          style: {
            background: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #F59E0B',
            fontWeight: '500',
            maxWidth: '380px',
          },
          icon: '⚠️',
        }
      );
    } else {
      const sizeKB = (file.size / 1024).toFixed(1);
      const pages = file.extractedPages ? ` • ${file.extractedPages} page(s)` : '';
      const chars = file.contentSnippet.length.toLocaleString();
      toast.success(
        `📄 ${file.name}\n${file.type.replace('_', ' ').toUpperCase()} • ${sizeKB} KB${pages} • ${chars} chars extracted`,
        { duration: 4000 }
      );
    }
  };

  const getIconForType = (type: UploadedFile['type']) => {
    switch (type) {
      case 'resume': return <Icons.Sidebar.FileText className="w-4 h-4 text-blue-500" width={16} height={16} />;
      case 'job_description': return <Icons.Sidebar.Briefcase className="w-4 h-4 text-orange-500" width={16} height={16} />;
      case 'company_info': return <Icons.Sidebar.Building className="w-4 h-4 text-green-500" width={16} height={16} />;
      default: return <Icons.Sidebar.FileText className="w-4 h-4 text-slate-500" width={16} height={16} />;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-[280px] bg-white border-r border-slate-200 flex flex-col h-full transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              J
            </div>
            <span className="font-bold text-slate-800 tracking-tight">JobOptimizer</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 p-1 hover:text-emerald-600 transition-colors" aria-label="Close sidebar">
            <Icons.Sidebar.ArrowLeft className="w-5 h-5" width={20} height={20} />
          </button>
        </div>

        {/* Global Navigation */}
        <div className="p-3 border-b border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all"
          >
            <Icons.Sidebar.Home className="w-5 h-5 text-indigo-500" width={20} height={20} />
            Home
          </Link>
        </div>

        {/* Current Project Context */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Current Workspace</h2>
          <div className="mb-4">
            <input
              value={currentProject.name}
              readOnly // Allow renaming in future
              className="text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-full pb-1 transition-colors"
            />
          </div>

          <FileUploader onFileUpload={onFileUpload} />

          {/* Current Files List */}
          <div className="space-y-2 mt-4">
            {currentProject.files.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">No files uploaded yet.</p>
            ) : (
              currentProject.files.map(file => (
                <button
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  title={`Click to view details for ${file.name}`}
                  className={`w-full flex items-center gap-2 p-2 rounded border text-xs text-left transition-all hover:shadow-md active:scale-[0.98] ${!file.contentSnippet || file.contentSnippet.trim().length === 0
                    ? 'bg-amber-50 border-amber-300 hover:border-amber-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                >
                  {getIconForType(file.type)}
                  <span className="truncate flex-1 font-medium text-slate-700">{file.name}</span>
                  {(!file.contentSnippet || file.contentSnippet.trim().length === 0) && (
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-1 py-0.5 rounded">⚠️ NO DATA</span>
                  )}
                  <span className="text-[10px] text-slate-400 uppercase">{file.type.replace('_', ' ')}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Project List / History */}
        <div className="flex-1 overflow-hidden p-5">
          <ProjectList
            projects={projects}
            currentProjectId={currentProject.id}
            onSelectProject={onSelectProject}
            onDeleteProject={onDeleteProject}
            onNewProject={onNewProject}
          />
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <Icons.Sidebar.User className="w-5 h-5" width={20} height={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">John Doe</p>
            <p className="text-[10px] text-slate-500">Free Tier</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
