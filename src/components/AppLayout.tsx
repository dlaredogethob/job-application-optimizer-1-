import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Icons } from './ui/icons';
import { useAppStore } from './AppProvider';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`
        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}
      `}
        >
            <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}>
                {icon}
            </span>
            {label}
        </Link>
    );
};

const AppLayout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, setUser } = useAppStore();
    const navigate = useNavigate();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleLogout = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 800)),
            {
                loading: 'Logging out...',
                success: 'Logged out successfully!',
                error: 'Logout failed.',
            }
        ).then(() => {
            setUser(null);
            navigate('/');
        });
    };

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery) {
            toast(`Searching for "${searchQuery}"...`, { icon: '🔍' });
            setSearchQuery('');
        }
    };

    const showNotification = () => {
        toast('No new notifications', { icon: '🔔' });
    };

    const showProfile = () => {
        navigate('/settings');
        toast.success('Navigated to Profile Settings');
    };

    const navItems = [
        { to: '/library', icon: <Icons.Actions.Library className="w-5 h-5" />, label: 'Resume Library' },
        { to: '/people', icon: <Icons.People.Users className="w-5 h-5" />, label: 'People & Profiles' },
        { to: '/albums', icon: <Icons.Auth.Briefcase className="w-5 h-5" />, label: 'Job Openings' },
        { to: '/settings', icon: <Icons.Settings.SettingsIcon className="w-5 h-5" />, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200">
                <div className="p-6 h-20 flex items-center border-b border-slate-100">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                            <Icons.Actions.LayoutDashboard className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl text-slate-800 tracking-tight">JobOpti</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2 mt-4">
                        Navigation
                    </div>
                    {navItems.map((item) => (
                        <NavItem key={item.to} {...item} />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                            {user?.name.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Guest'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email || 'N/A'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Icons.Actions.LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative w-full overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Icons.Nav.Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden md:flex relative group">
                            <Icons.Actions.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-sm w-64 lg:w-96 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={showNotification}
                            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <Icons.Settings.Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button
                            onClick={showProfile}
                            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
                                <Icons.Settings.User className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="hidden sm:block text-sm font-semibold text-slate-700">{user?.name || 'User'}</span>
                        </button>
                    </div>
                </header>

                {/* Content Viewport */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`
        lg:hidden fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 h-20 flex items-center justify-between border-b border-slate-100">
                    <Link to="/" className="flex items-center gap-2" onClick={toggleMobileMenu}>
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                            <Icons.Actions.LayoutDashboard className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl text-slate-800">JobOpti</span>
                    </Link>
                    <button onClick={toggleMobileMenu} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                        <Icons.Actions.X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavItem key={item.to} {...item} onClick={toggleMobileMenu} />
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{user?.name}</p>
                            <p className="text-sm text-slate-500">{user?.email}</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 py-3 rounded-xl font-semibold transition-all">
                        <Icons.Actions.LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default AppLayout;
