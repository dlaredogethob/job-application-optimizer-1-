import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { create } from 'zustand';

// --- Types ---
interface AppState {
    user: {
        name: string;
        email: string;
        avatar?: string;
    } | null;
    setUser: (user: AppState['user']) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// --- Zustand Store ---
export const useAppStore = create<AppState>((set) => ({
    user: null, // Start as unauthenticated to show Landing Page
    setUser: (user) => set({ user }),
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

// --- Theme Context ---
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={theme === 'dark' ? 'dark' : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Global Error Boundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
                    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Something went wrong</h2>
                        <p className="text-slate-600 mb-6">We've encountered an unexpected error. Please try refreshing the page.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                        >
                            Refresh App
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- Main AppProvider ---
const queryClient = new QueryClient();

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
};

export default AppProvider;
