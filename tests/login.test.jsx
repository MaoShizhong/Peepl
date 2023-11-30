import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider } from 'react-router-dom';
import { beforeAll, describe, expect, it, test, vi } from 'vitest';
import * as hooks from '../src/helpers/hooks.js';
import { router } from '../src/router.jsx';

describe('Auto-login', () => {
    test('<App /> shows login screen if auto-login fails', async () => {
        vi.spyOn(hooks, 'useAutoLogin').mockImplementation(() => {
            return { user: null, setUser: vi.fn(), initialising: false };
        });

        render(<RouterProvider router={router} />);

        await vi.waitFor(() => {
            expect(hooks.useAutoLogin).toBeCalledTimes(1);
            expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: /login\swith\sdemo\saccount\s1/i })
            ).toBeInTheDocument();
        });
    });

    test('<App /> shows feed if auto-login succeeds with user', async () => {
        const mockUser = {
            handle: 'test-handle000000',
            email: 'email@email.com',
            details: { firstName: 'First', lastName: 'Last', DOB: new Date() },
            isDemo: false,
            isGithubOnly: false,
        };

        vi.spyOn(hooks, 'useAutoLogin').mockImplementation(() => {
            return {
                user: mockUser,
                setUser: vi.fn(),
                initialising: false,
            };
        });

        render(<RouterProvider router={router} />);

        await vi.waitFor(() => {
            const header = screen.getByRole('banner');
            expect(header).toBeInTheDocument();

            const notificationsButton = within(header).getByRole('button', {
                name: /notifications/i,
            });
            const friendRequestsButton = within(header).getByRole('button', {
                name: /friend\srequests/i,
            });
            const linkToProfile = within(header).getByRole('link', { name: /profile/i });
            const settingsButton = within(header).getByRole('button', { name: /settings/i });
            const searchBar = within(header).getByRole('search');

            expect(notificationsButton).toBeInTheDocument();
            expect(friendRequestsButton).toBeInTheDocument();
            expect(linkToProfile).toBeInTheDocument();
            expect(settingsButton).toBeInTheDocument();
            expect(searchBar).toBeInTheDocument();

            expect(screen.getByRole('heading', { name: /your\sfeed/i })).toBeInTheDocument();

            const newPostTextarea = screen.getByRole('textbox', { name: 'post' });
            expect(newPostTextarea.placeholder).toBe(
                `What's on your mind, ${mockUser.details.firstName}?`
            );
        });
    });
});

describe('Login/sign-up form switching', () => {
    beforeAll(() => {
        vi.spyOn(hooks, 'useAutoLogin').mockImplementation(() => {
            return { user: null, setUser: vi.fn(), initialising: false };
        });
    });

    it('Switches to sign-up form when option selected', async () => {
        render(<RouterProvider router={router} />);

        const signUpFormButton = screen.getByRole('button', {
            name: 'Switch to account creation screen',
        });

        const user = userEvent.setup();
        await user.click(signUpFormButton);

        expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Login' })).toBe(null);
        expect(screen.queryByRole('button', { name: /login\swith\sdemo\saccount\s1/i })).toBe(null);
    });

    it('Switches back to login form when option selected whilst on sign-up form', async () => {
        render(<RouterProvider router={router} />);

        const signUpFormButton = screen.getByRole('button', {
            name: 'Switch to account creation screen',
        });
        const loginFormButton = screen.getByRole('button', {
            name: 'Switch to login screen',
        });

        const user = userEvent.setup();
        await user.click(signUpFormButton);

        expect(screen.queryByRole('button', { name: 'Login' })).toBe(null);

        await user.click(loginFormButton);

        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /login\swith\sdemo\saccount\s1/i })
        ).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Create account' })).toBe(null);
    });
});

describe('Demo login', () => {
    beforeAll(() => {
        vi.spyOn(hooks, 'useAutoLogin').mockImplementation(() => {
            return {
                user: null,
                setUser: () => {
                    return {
                        handle: 'nice-demo000000',
                        email: 'email@email.com',
                        details: { firstName: 'First', lastName: 'Last', DOB: new Date() },
                        isDemo: false,
                        isGithubOnly: false,
                    };
                },
                initialising: false,
            };
        });
    });

    it.skip('Logs in with demo account 1', async () => {
        render(<RouterProvider router={router} />);

        const demoOneLoginButton = screen.getByRole('button', {
            name: 'Login with demo account 1',
        });

        const user = userEvent.setup();
        await user.click(demoOneLoginButton);

        await vi.waitFor(() => {
            expect(screen.getByRole('heading', { name: /your\sfeed/i })).toBeInTheDocument();

            const newPostTextarea = screen.getByRole('textbox', { name: 'post' });
            expect(newPostTextarea.placeholder).toBe(`What's on your mind, Demo?`);
        });
    });
});
