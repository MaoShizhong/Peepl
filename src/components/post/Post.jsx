import { useEffect, useRef, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useCloseDropdown } from '../../helpers/hooks';
import { getFullNameFromDetails, getRelativeTimestamp } from '../../helpers/util';
import postStyles from './css/post.module.css';

export function Post({ post }) {
    const { user } = useOutletContext();
    const [showMenu, setShowMenu] = useState(false);

    const buttonRef = useRef();
    const menuRef = useRef();

    useCloseDropdown(menuRef, buttonRef, setShowMenu);

    useEffect(() => {
        if (menuRef.current) menuRef.current.show();
    }, [showMenu]);

    return (
        <article className={postStyles.post}>
            <img
                className={postStyles.profilePicture}
                src={post.author.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                alt="author profile picture"
            />

            <div className={postStyles.contents}>
                <div className={postStyles.top}>
                    <Link to={`/${post.author.handle}`}>
                        {user._id === post.author._id
                            ? 'You'
                            : getFullNameFromDetails(post.author.details)}
                    </Link>

                    <div className={postStyles.menuWrapper}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className={postStyles.menuButton}
                            ref={buttonRef}
                        >
                            <svg width="64px" height="64px" viewBox="0 0 16 16" fill="currentColor">
                                <g>
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                                </g>
                            </svg>
                        </button>

                        {showMenu && (
                            <dialog className={postStyles.menu} ref={menuRef}>
                                <button>Edit</button>
                                <button>Delete</button>
                            </dialog>
                        )}
                    </div>
                </div>

                <p>{post.body}</p>

                <div>
                    <span className={postStyles.timestamp}>
                        {getRelativeTimestamp(post.timestamp)}
                    </span>
                    <button className={postStyles.likeButton}>Like</button>
                </div>
            </div>
        </article>
    );
}
