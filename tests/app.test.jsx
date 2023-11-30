import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { router } from '../src/router.jsx';

import * as hooks from '../src/helpers/hooks';

describe('Login', async () => {
    test('<App /> shows login screen if auto-login fails', async () => {
        vi.spyOn(hooks, 'useAutoLogin').mockImplementation(() => {
            return { user: null, setUser: vi.fn(), initialising: false };
        });

        render(<RouterProvider router={router} />);

        await vi.waitFor(() => {
            expect(hooks.useAutoLogin).toBeCalledTimes(1);
            expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: 'Login with demo account 1' })
            ).toBeInTheDocument();
        });
    });

    test('<App /> shows feed if auto-login succeeds with user', async () => {
        vi.spyOn(hooks, 'useAutoLogin').mockImplementation(() => {
            return {
                user: {
                    handle: 'handle',
                    email: 'email@email.com',
                    details: { firstName: 'First', lastName: 'Last', DOB: new Date() },
                    isDemo: false,
                    isGithubOnly: false,
                },
                setUser: vi.fn(),
                initialising: false,
            };
        });

        render(<RouterProvider router={router} />);

        await vi.waitFor(() => {
            expect(screen.getByRole('banner')).toBeInTheDocument();
        });
    });
});
