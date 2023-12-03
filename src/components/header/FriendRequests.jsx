import { useRef } from 'react';
import { useCloseDropdown } from '../../helpers/hooks';
import headerStyles from './header.module.css';

export function FriendRequests({ setIsOpen, button }) {
    const dropdownRef = useRef(null);

    useCloseDropdown(dropdownRef, button, setIsOpen);

    return (
        <div
            className={headerStyles.dropdown}
            id="friend-requests-dropdown"
            aria-label="friend requests dropdown"
            ref={dropdownRef}
        >
            FriendRequests
        </div>
    );
}
