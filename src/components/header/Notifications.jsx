import { useRef } from 'react';
import { useCloseDropdown } from '../../helpers/hooks';
import dropdownStyles from './css/dropdown.module.css';

export function Notifications({ setIsOpen, button }) {
    const dropdownRef = useRef(null);

    useCloseDropdown(dropdownRef, button, setIsOpen);

    return (
        <div
            id="notifications-dropdown"
            aria-label="notifications dropdown"
            className={dropdownStyles.dropdown}
            ref={dropdownRef}
        >
            <p className={`${dropdownStyles.empty} ${dropdownStyles.text}`}>No notifications</p>
        </div>
    );
}
