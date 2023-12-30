import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchButton } from '../buttons/SearchButton';
import { AccountMenu } from './AccountMenu';
import { FriendRequests } from './FriendRequests';
import { Notifications } from './Notifications';
import headerStyles from './css/header.module.css';

export function Header({ setUser, userHandle, userID }) {
    const [notificationsIsOpen, setNotificationsIsOpen] = useState(false);
    const [friendRequestsIsOpen, setFriendRequestsIsOpen] = useState(false);
    const [accountIsOpen, setAccountIsOpen] = useState(false);

    const notificationsRef = useRef(null);
    const friendRequestsRef = useRef(null);
    const accountRef = useRef(null);
    const goTo = useNavigate();

    function goToSearchResults(e) {
        e.preventDefault();

        const query = e.target.search.value.trim();
        if (query) {
            goTo(`/search?q=${encodeURI(query)}`);
        } else {
            goTo('/search');
        }
    }

    return (
        <header className={headerStyles.header}>
            <div className={headerStyles.contents}>
                <Link to="/" className={headerStyles.logo}>
                    Peepl
                </Link>

                <div className={headerStyles.dropdowns}>
                    <button
                        aria-controls="friend-requests-dropdown"
                        aria-expanded={friendRequestsIsOpen}
                        aria-label="friend requests"
                        onClick={() => setFriendRequestsIsOpen(!friendRequestsIsOpen)}
                        ref={friendRequestsRef}
                    >
                        <svg fill="currentColor" width="64px" height="64px" viewBox="0 -64 640 640">
                            <g>
                                <path d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"></path>
                            </g>
                        </svg>
                    </button>

                    <button
                        aria-controls="notifications-dropdown"
                        aria-expanded={notificationsIsOpen}
                        aria-label="notifications"
                        onClick={() => setNotificationsIsOpen(!notificationsIsOpen)}
                        ref={notificationsRef}
                    >
                        <svg width="64px" height="64px" viewBox="0 0 24 24" fill="currentColor">
                            <g>
                                <path d="M3 18a1 1 0 0 1-.894-1.447L4 12.763V10a8 8 0 1 1 16 0v2.764l1.894 3.789A1 1 0 0 1 21 18H3ZM12 22a4.002 4.002 0 0 1-3.874-3h7.748A4.002 4.002 0 0 1 12 22Z"></path>
                            </g>
                        </svg>
                    </button>

                    {friendRequestsIsOpen && (
                        <FriendRequests
                            setIsOpen={setFriendRequestsIsOpen}
                            button={friendRequestsRef}
                        />
                    )}

                    {notificationsIsOpen && (
                        <Notifications
                            setIsOpen={setNotificationsIsOpen}
                            button={notificationsRef}
                        />
                    )}
                </div>

                <div className={headerStyles.bar}>
                    <form onSubmit={goToSearchResults}>
                        <input
                            type="search"
                            name="search"
                            aria-label="search peepl"
                            placeholder="Search"
                            defaultValue=""
                            className={headerStyles.search}
                            required
                        />
                        <SearchButton header={true} />
                    </form>

                    <nav className={headerStyles.nav}>
                        <Link to="/">Feed</Link>

                        <button
                            aria-controls="account-menu-dropdown"
                            aria-expanded={accountIsOpen}
                            aria-label="account menu"
                            onClick={() => setAccountIsOpen(!accountIsOpen)}
                            ref={accountRef}
                        >
                            Account
                        </button>

                        {accountIsOpen && (
                            <AccountMenu
                                setIsOpen={setAccountIsOpen}
                                button={accountRef}
                                setUser={setUser}
                                userHandle={userHandle}
                                userID={userID}
                            />
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
