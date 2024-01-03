import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorPage } from './components/error/ErrorPage';
import { Feed } from './components/feed/Feed';
import { GithubRedirectLogin } from './components/login/GithubRedirectLogin';
import { Profile } from './components/profile/Profile';
import { SearchPage } from './components/search/SearchPage';
import { Settings } from './components/settings/Settings';
import { AccountDeletion } from './components/token_auth/AccountDeletion';
import { PasswordReset } from './components/token_auth/PasswordReset';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: '/login/:token', element: <GithubRedirectLogin /> },
            { path: '/feed?', element: <Feed /> },
            { path: '/:handle', element: <Profile /> },
            { path: '/search', element: <SearchPage /> },
            { path: '/settings', element: <Settings /> },
            { path: '/error', element: <ErrorPage /> },
        ],
    },
    {
        path: '/password-reset/:token',
        element: <PasswordReset />,
    },
    {
        path: '/delete-account/:token',
        element: <AccountDeletion />,
    },
]);
