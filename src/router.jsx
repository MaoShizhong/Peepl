import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorPage } from './components/error/ErrorPage';
import { Feed } from './components/feed/Feed';
import { Profile } from './components/profile/Profile';
import { SearchPage } from './components/search/SearchPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: '/feed?', element: <Feed /> },
            { path: '/:handle', element: <Profile /> },
            { path: '/search', element: <SearchPage /> },
            { path: '/error', element: <ErrorPage /> },
        ],
    },
]);
