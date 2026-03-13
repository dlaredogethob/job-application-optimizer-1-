import React from 'react';
import { Icons } from '../components/ui/icons';
import { toast } from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

export const SettingsPage: React.FC = () => {
    const sections = [
        { icon: <Icons.Settings.User className="w-5 h-5" />, title: 'Profile Settings', desc: 'Manage Corbin\'s public details and contact info.' },
        { icon: <Icons.Settings.Bell className="w-5 h-5" />, title: 'Notifications', desc: 'Configure how you receive job alerts at dummy@gmail.com.' },
        { icon: <Icons.Settings.Shield className="w-5 h-5" />, title: 'Privacy & Security', desc: 'Control your visibility and API keys.' },
        { icon: <Icons.Settings.CreditCard className="w-5 h-5" />, title: 'Subscription', desc: 'Manage your billing and plan details.' },
    ];

    const handleSectionClick = (title: string) => {
        toast(`Configuring ${title}...`, { icon: '⚙️' });
    };

    return (
        <div>
            <PageHeader
                title="Settings"
                subtitle="Configure your experience and account preferences."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => handleSectionClick(s.title)}
                        className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left group"
                    >
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                            {s.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-1">{s.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SettingsPage;
