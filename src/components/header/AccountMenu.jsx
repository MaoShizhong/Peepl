import { useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../../helpers/fetch';
import { useCloseDropdown } from '../../helpers/hooks';
import dropdownStyles from './css/dropdown.module.css';

export function AccountMenu({ setIsOpen, button, setUser, userHandle }) {
    const { handle } = useParams();
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
            className={`${dropdownStyles.dropdown} ${dropdownStyles.accountMenu}`}
            aria-label="account menu dropdown"
            ref={dropdownRef}
        >
            <Link to={`/${userHandle}`} state={userHandle} reloadDocument={userHandle === handle}>
                Profile
            </Link>
            <Link to="/settings">Account settings</Link>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
