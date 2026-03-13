import React from 'react';
import { Icons } from '../components/ui/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

export const LibraryPage: React.FC = () => {
    const navigate = useNavigate();
    const resumes = [
        { id: '1', name: 'Project 1 - Google Frontend', lastEdited: '2 hours ago', status: 'Draft', match: 92 },
        { id: '2', name: 'Project 2 - Stripe Lead', lastEdited: 'Yesterday', status: 'Optimized', match: 88 },
        { id: '3', name: 'Project 3 - Amazon SDE', lastEdited: '2 days ago', status: 'Completed', match: 90 },
        { id: '4', name: 'Project 4 - Netflix UI', lastEdited: '2 days ago', status: 'Draft', match: 85 },
        { id: '5', name: 'Project 5 - Apple Design', lastEdited: '3 days ago', status: 'Optimized', match: 94 },
        { id: '6', name: 'Project 6 - Meta Product', lastEdited: '3 days ago', status: 'Completed', match: 95 },
    ];

    const handleCreateNew = () => {
        toast.success('Creating new optimization project...');
        navigate('/studio');
    };

    const handleOpenResume = (id: string, name: string) => {
        toast(`Opening ${name}...`, { icon: '📂' });
        navigate('/studio');
    };

    return (
        <div className="h-full">
            <PageHeader
                title="Resume Library"
                subtitle="Manage and optimize your professional documents."
                action={
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all active:scale-95"
                    >
                        <Icons.Library.Plus className="w-5 h-5" width={20} height={20} />
                        Create New
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create One - Ghost Card */}
                <button
                    onClick={handleCreateNew}
                    className="group border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all min-h-[220px]"
                >
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                        <Icons.Library.Plus className="w-8 h-8" width={32} height={32} />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Create One</h3>
                        <p className="text-xs text-slate-400 mt-1">Start a new optimization</p>
                    </div>
                </button>

                {resumes.map(resume => (
                    <div
                        key={resume.id}
                        onClick={() => handleOpenResume(resume.id, resume.name)}
                        className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer relative"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                                <Icons.Library.File className="w-6 h-6" width={24} height={24} />
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); toast('Menu coming soon!', { icon: '🛠️' }); }}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <Icons.Library.Menu className="w-5 h-5" width={20} height={20} />
                            </button>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors">{resume.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-medium">
                            <Icons.Library.History className="w-3.5 h-3.5" width={14} height={14} />
                            Edited {resume.lastEdited}
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${resume.status === 'Optimized' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                {resume.status}
                            </span>
                            <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg">
                                <Icons.Library.Trending className="w-4 h-4 text-emerald-500" width={16} height={16} />
                                <span className="text-sm font-bold text-emerald-700">{resume.match}% Match</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LibraryPage;
