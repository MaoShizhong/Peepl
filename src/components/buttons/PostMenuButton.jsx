import { useEffect, useRef, useState } from 'react';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { useCloseDropdown } from '../../helpers/hooks';
import { Loading } from '../loading/Loading';
import buttonStyles from './css/button.module.css';

export function PostMenuButton({ userID, postID, setPosts, setIsEditMode }) {
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    useCloseDropdown(menuRef, buttonRef, setShowMenu);

    useEffect(() => {
        if (menuRef.current) menuRef.current.show();
    }, [showMenu]);

    async function deletePost() {
        setLoading(true);

        const deleteRes = await fetchData(`/posts/${postID}?userID=${userID}`, 'DELETE');

        if (deleteRes instanceof Error || !deleteRes.ok) {
            alert(SERVER_ERROR);
        } else {
            setPosts((prev) => prev.filter((post) => post._id !== postID));
        }

        setLoading(false);
    }

    return (
        <div className={buttonStyles.menuWrapper}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className={buttonStyles.menuButton}
                aria-label="post options menu"
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
                        aria-label="edit post"
                    >
                        Edit
                    </button>

                    <button onClick={deletePost} aria-label="delete post">
                        {loading ? <Loading isInButton={true} /> : 'Delete'}
                    </button>
                </dialog>
            )}
        </div>
    );
}
