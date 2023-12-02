import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, test } from 'vitest';
import { Header } from '../src/components/header/Header';

describe('Header buttons', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
    });

    test('<Header /> contains a searchbar, and notifications, friend request and account buttons', () => {
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();

        const notificationsButton = within(header).getByRole('button', {
            name: /notifications/i,
        });
        const friendRequestsButton = within(header).getByRole('button', {
            name: /friend\srequests/i,
        });
        const linkToProfile = within(header).getByRole('button', { name: /account/i });
        const searchBar = within(header).getByRole('searchbox');

        expect(notificationsButton).toBeInTheDocument();
        expect(friendRequestsButton).toBeInTheDocument();
        expect(linkToProfile).toBeInTheDocument();
        expect(searchBar).toBeInTheDocument();
    });

    it('Opens the notifications dropdown when the notifications button is clicked', async () => {
        const notificationsButton = screen.getByRole('button', { name: /notifications/i });

        expect(screen.queryByRole('generic', { name: /notifications\sdropdown/i })).toBe(null);

        const user = userEvent.setup();
        await user.click(notificationsButton);

        expect(
            screen.getByRole('generic', { name: /notifications\sdropdown/i })
        ).toBeInTheDocument();
    });

    it('Opens the friends request dropdown when the friends request button is clicked', async () => {
        const friendsRequestButton = screen.getByRole('button', { name: /friend\srequests/i });

        expect(screen.queryByRole('generic', { name: /friend\srequests\sdropdown/i })).toBe(null);

        const user = userEvent.setup();
        await user.click(friendsRequestButton);

        expect(
            screen.getByRole('generic', { name: /friend\srequests\sdropdown/i })
        ).toBeInTheDocument();
    });

    it('Opens the account dropdown when the account button is clicked', async () => {
        const accountButton = screen.getByRole('button', { name: /account/i });

        expect(screen.queryByRole('generic', { name: /account\smenu\sdropdown/i })).toBe(null);

        const user = userEvent.setup();
        await user.click(accountButton);

        const dropdown = screen.getByRole('generic', { name: /account\smenu\sdropdown/i });

        expect(dropdown).toBeInTheDocument();
        expect(within(dropdown).getByRole('link', { name: /profile/i })).toBeInTheDocument();
        expect(
            within(dropdown).getByRole('button', { name: /account\ssettings/i })
        ).toBeInTheDocument();
        expect(within(dropdown).getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('Clicking anywhere outside of an open dropdown closes it', async () => {
        const header = screen.getByRole('banner');
        const notificationsButton = screen.getByRole('button', { name: /notifications/i });
        const friendsRequestButton = screen.getByRole('button', { name: /friend\srequests/i });

        const user = userEvent.setup();
        await user.click(notificationsButton);
        await user.click(header);

        expect(screen.queryByRole('generic', { name: /notifications\sdropdown/i })).toBe(null);

        await user.click(friendsRequestButton);
        await user.click(header);

        expect(screen.queryByRole('generic', { name: /friend\srequests\sdropdown/i })).toBe(null);
    });
});
