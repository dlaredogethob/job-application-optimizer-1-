import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Studio from './pages/Studio';
import LibraryPage from './pages/LibraryPage';
import PeoplePage from './pages/PeoplePage';
import AlbumsPage from './pages/AlbumsPage';
import SettingsPage from './pages/SettingsPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './components/AppLayout';

/**
 * Main application router configuration using React Router v6.
 * Implements a layout-first architecture with protected children routes.
 */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/signup',
        element: <SignupPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        // Main App Shell context
        element: <AppLayout />,
        children: [
            {
                path: 'library',
                element: <LibraryPage />,
            },
            {
                path: 'people',
                element: <PeoplePage />,
            },
            {
                path: 'albums',
                element: <AlbumsPage />,
            },
            {
                path: 'settings',
                element: <SettingsPage />,
            },
            {
                path: 'studio',
                element: <Studio />,
            },
            {
                path: '404',
                element: <NotFoundPage />,
            },
        ],
    },
    // Global 404 handler
    {
        path: '*',
        element: <Navigate to="/404" replace />,
    },
], {
    basename: import.meta.env.BASE_URL,
});

export default router;
