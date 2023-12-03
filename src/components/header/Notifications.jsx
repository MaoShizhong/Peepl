import { useRef } from 'react';
import { useCloseDropdown } from '../../helpers/hooks';
import headerStyles from './header.module.css';

export function Notifications({ setIsOpen, button }) {
    const dropdownRef = useRef(null);

    useCloseDropdown(dropdownRef, button, setIsOpen);

    return (
        <div id="notifications-dropdown" aria-label="notifications dropdown" className={headerStyles.dropdown} ref={dropdownRef}>
            Notifications
        </div>
    );
}
