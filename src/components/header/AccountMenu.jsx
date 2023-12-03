import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../../helpers/fetch';
import { useCloseDropdown } from '../../helpers/hooks';
import headerStyles from './header.module.css';

export function AccountMenu({ setIsOpen, button, setUser, userHandle, userID }) {
    const goTo = useNavigate();
    const dropdownRef = useRef(null);

    useCloseDropdown(dropdownRef, button, setIsOpen);

    async function logout() {
        // No need to check response status - if no session then logout anyway
        await fetchData('/auth/sessions', 'DELETE');
        setUser(null);
        goTo('/');
    }

    return (
        <div
            id="account-menu-dropdown"
            className={headerStyles.dropdown}
            aria-label="account menu dropdown"
            ref={dropdownRef}
        >
            <button>
                <Link to={`/${userHandle}`} state={{ _id: userID }}>
                    Profile
                </Link>
            </button>
            <button>Account settings</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
