import React from 'react';
import { Icons } from '../components/ui/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

export const PeoplePage: React.FC = () => {
    const navigate = useNavigate();
    const profiles = [
        { name: 'Corbin', role: 'Fullstack Developer', email: 'dummy@gmail.com', location: 'Phoenix, AZ' },
        { name: 'Corbin Team Lead', role: 'Engineering Lead', email: 'dummy@gmail.com', location: 'Remote' },
        { name: 'Jane Smith (Mock)', role: 'UI/UX Designer', email: 'dummy@gmail.com', location: 'San Francisco, CA' },
        { name: 'Bob Wilson (Mock)', role: 'DevOps Engineer', email: 'dummy@gmail.com', location: 'Austin, TX' },
        { name: 'Alice Brown (Mock)', role: 'Project Manager', email: 'dummy@gmail.com', location: 'New York, NY' },
    ];

    const handleViewProfile = (name: string) => {
        toast(`Viewing profile of ${name}...`, { icon: '👤' });
        navigate('/settings');
    };

    return (
        <div>
            <PageHeader
                title="People & Profiles"
                subtitle="Manage candidate profiles and professional personas."
            />
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Current Role</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {profiles.map((p, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                                            {p.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-800">{p.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{p.role}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5"><Icons.Auth.Mail className="w-3 h-3" /> {p.email}</div>
                                        <div className="flex items-center gap-1.5"><Icons.People.Phone className="w-3 h-3" /> +1 (555) 123-4567</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-1.5">
                                    <Icons.People.MapPin className="w-4 h-4 text-slate-400" /> {p.location}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleViewProfile(p.name)}
                                        className="text-emerald-600 font-bold text-sm hover:underline"
                                    >
                                        View Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PeoplePage;
