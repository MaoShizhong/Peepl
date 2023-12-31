import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRouter from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { Profile } from '../src/components/profile/Profile';
import * as hooks from '../src/helpers/hooks.js';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Own profile', () => {
    beforeEach(() => {
        vi.spyOn(reactRouter, 'useOutletContext').mockImplementation(() => {
            return {
                user: {
                    handle: 'mocked-profile000000',
                    email: 'email@email.com',
                    details: {
                        firstName: 'Mock',
                        lastName: 'Profile',
                        DOB: new Date().toISOString(),
                    },
                    isDemo: false,
                    isGithubOnly: false,
                },
            };
        });
        vi.spyOn(hooks, 'useProfile').mockImplementation(() => {
            return {
                profileUser: {
                    handle: 'mocked-profile000000',
                    profilePicture: null,
                    galleryIsHidden: false,
                    name: 'Mock Profile',
                    DOB: new Date().toISOString(),
                    city: 'Mockton',
                    country: 'Mockland',
                    employment: [],
                    education: [],
                },
                friendsList: [],
                wallPosts: [],
                loading: false,
            };
        });
        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
    });

    test('Key profile elements rendered (defaults to "wall" tab)', () => {
        expect(screen.getByAltText('profile picture')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /new\spost/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /wall/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /info/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /gallery/i })).toBeInTheDocument();
    });

    it('Shows own-profile-specific new post placeholder text', () => {
        expect(screen.getByPlaceholderText("What's on your mind, Mock?")).toBeInTheDocument();
    });

    it('Replaces profile wall with profile info section when info tab selected', async () => {
        const infoTab = screen.getByRole('button', { name: /info/i });

        const user = userEvent.setup();
        await user.click(infoTab);

        expect(screen.queryAllByRole('textbox')).toHaveLength(0);
        expect(screen.getByRole('heading', { name: /details/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /education/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /employment/i })).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /edit\sdetails/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit\seducation/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit\semployment/i })).toBeInTheDocument();
    });
});

describe('Not own profile', () => {
    beforeEach(() => {
        vi.spyOn(reactRouter, 'useOutletContext').mockImplementation(() => {
            return {
                user: {
                    handle: 'mocked-profile000000',
                    email: 'email@email.com',
                    details: {
                        firstName: 'Mock',
                        lastName: 'Profile',
                        DOB: new Date().toISOString(),
                    },
                    isDemo: false,
                    isGithubOnly: false,
                },
            };
        });
        vi.spyOn(reactRouter, 'useLocation').mockImplementation(() => {
            return { state: { _id: null } };
        });
        vi.spyOn(hooks, 'useProfile').mockImplementation(() => {
            return {
                profileUser: {
                    handle: 'different-profile000000',
                    profilePicture: null,
                    galleryIsHidden: false,
                    name: 'Different Profile',
                    DOB: new Date().toISOString(),
                    city: 'Differentton',
                    country: 'Differentland',
                    employment: [],
                    education: [],
                },
                friendsList: [],
                wallPosts: [],
                loading: false,
            };
        });
        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
    });

    it("Shows new post placeholder text for a profile that is not the logged in user's", () => {
        expect(
            screen.getByPlaceholderText("Post something on Different's wall!")
        ).toBeInTheDocument();
        expect(screen.queryByPlaceholderText("What's on your mind, Mock?")).toBe(null);
    });

    it('Does not render "edit" buttons on info tab if not own profile', async () => {
        const infoTab = screen.getByRole('button', { name: /info/i });

        const user = userEvent.setup();
        await user.click(infoTab);

        expect(screen.queryAllByRole('textbox')).toHaveLength(0);

        expect(screen.queryByRole('button', { name: /edit\sdetails/i })).toBe(null);
        expect(screen.queryByRole('button', { name: /edit\seducation/i })).toBe(null);
        expect(screen.queryByRole('button', { name: /edit\semployment/i })).toBe(null);
    });
});
