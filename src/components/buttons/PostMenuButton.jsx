import { useEffect, useRef, useState } from 'react';
import { useCloseDropdown } from '../../helpers/hooks';
import buttonStyles from './css/button.module.css';

export function PostMenuButton({ postID, setIsEditMode }) {
    const [showMenu, setShowMenu] = useState(false);

    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    useCloseDropdown(menuRef, buttonRef, setShowMenu);

    useEffect(() => {
        if (menuRef.current) menuRef.current.show();
    }, [showMenu]);

    return (
        <div className={buttonStyles.menuWrapper}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className={buttonStyles.menuButton}
                ref={buttonRef}
            >
                <svg width="64px" height="64px" viewBox="0 0 16 16" fill="currentColor">
                    <g>
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                    </g>
                </svg>
            </button>

            {showMenu && (
                <dialog className={buttonStyles.menu} ref={menuRef}>
                    <button
                        onClick={() => {
                            setIsEditMode(true);
                            setShowMenu(false);
                        }}
                    >
                        Edit
                    </button>
                    <button>Delete</button>
                </dialog>
            )}
        </div>
    );
}
