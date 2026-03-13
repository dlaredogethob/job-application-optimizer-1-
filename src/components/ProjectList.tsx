import React from 'react';
import { Icons } from './ui/icons';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onDeleteProject,
  onNewProject
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <button
          onClick={onNewProject}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Icons.Sidebar.Folder className="w-5 h-5" width={20} height={20} /> New Project
        </button>
      </div>

      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">History</h3>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-hide">
        {projects.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p className="text-xs">No projects yet.</p>
          </div>
        )}

        {projects.sort((a, b) => b.lastModified - a.lastModified).map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`
              group relative p-3 rounded-lg border cursor-pointer transition-all duration-200
              ${currentProjectId === project.id
                ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-100'
                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}
            `}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className={`text-sm font-semibold truncate pr-6 ${currentProjectId === project.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                {project.name}
              </h4>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity absolute top-3 right-3 p-1"
                title="Delete Project"
              >
                <Icons.Sidebar.Trash className="w-4 h-4" width={16} height={16} />
              </button>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
              <Icons.Sidebar.Clock className="w-3.5 h-3.5" width={14} height={14} />
              <span>{new Date(project.lastModified).toLocaleDateString()}</span>
            </div>

            {project.files.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.files.slice(0, 3).map(f => (
                  <span key={f.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[100px]">
                    <Icons.Sidebar.FileText className="w-3 h-3 mr-1" width={12} height={12} /> {f.name}
                  </span>
                ))}
                {project.files.length > 3 && (
                  <span className="text-[10px] text-slate-400">+{project.files.length - 3}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
