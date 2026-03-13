import React from 'react';
import { Icons } from '../components/ui/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

export const AlbumsPage: React.FC = () => {
    const navigate = useNavigate();
    const jobs = [
        { title: 'Project 1 - Senior React Developer', company: 'TechCorp', salary: '$140k - $180k', type: 'Full-time' },
        { title: 'Project 2 - Frontend Lead', company: 'Stripe', salary: '$160k - $210k', type: 'Remote' },
        { title: 'Project 3 - Senior SDE', company: 'Amazon', salary: '$150k - $190k', type: 'Full-time' },
        { title: 'Project 4 - Mobile Architect', company: 'Netflix', salary: '$180k - $240k', type: 'Full-time' },
        { title: 'Project 5 - UI Design Lead', company: 'Apple', salary: '$160k - $200k', type: 'Full-time' },
        { title: 'Project 6 - UI Specialist', company: 'Linear', salary: '$130k - $170k', type: 'Contract' },
    ];

    const handleApply = (title: string) => {
        toast(`Preparing optimization for ${title}...`, { icon: '🎯' });
        navigate('/studio');
    };

    return (
        <div>
            <PageHeader
                title="Job Openings"
                subtitle="Track roles and tailor resumes for specific opportunities."
            />
            <div className="space-y-4">
                {jobs.map((job, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                <Icons.Albums.Target className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{job.title}</h3>
                                <p className="text-sm text-slate-500">{job.company} • {job.salary}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">{job.type}</span>
                            <button
                                onClick={() => handleApply(job.title)}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all active:scale-95"
                            >
                                <Icons.Albums.ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlbumsPage;
