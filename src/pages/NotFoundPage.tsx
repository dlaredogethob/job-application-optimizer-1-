import React from 'react';
import { Icons } from '../components/ui/icons';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
    <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-8 border border-slate-200">
            <Icons.People.Users className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">404 - Page Not Found</h1>
        <p className="text-slate-500 max-w-md mb-8 leading-relaxed font-medium">The page you were looking for doesn't exist or has been moved to a new galaxy.</p>
        <Link to="/" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all">
            Return Home
        </Link>
    </div>
);

export default NotFoundPage;
