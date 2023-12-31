import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './global_stylesheets/reset.css';
import './global_stylesheets/theme.css';
import { router } from './router.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    //     <RouterProvider router={router} />
    // </React.StrictMode>
    <RouterProvider router={router} />
);
