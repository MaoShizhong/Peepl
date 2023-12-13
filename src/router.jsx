import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorPage } from './components/error/ErrorPage';
import { Feed } from './components/feed/Feed';
import { Profile } from './components/profile/Profile';
import { Search } from './components/search/Search';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: '/feed?', element: <Feed /> },
            { path: '/:handle', element: <Profile /> },
            { path: '/search', element: <Search /> },
            { path: '/error', element: <ErrorPage /> },
        ],
    },
]);
