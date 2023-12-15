import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE, SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import {
    autoResizeTextarea,
    getFullNameFromDetails,
    getRelativeTimestamp,
} from '../../helpers/util';
import { PostMenuButton } from '../buttons/PostMenuButton';
import buttonStyles from '../buttons/css/button.module.css';
import { Loading } from '../loading/Loading';
import postStyles from './css/post.module.css';

export function Post({ post, setPosts }) {
    const { user } = useOutletContext();
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    async function editPost(e) {
        e.preventDefault();
        setLoading(true);

        const textarea = e.target.body;

        const editRes = await fetchData(`/users/${user._id}/posts/${post._id}`, 'PUT', {
            data: { body: textarea.value },
        });

        if (editRes instanceof Error || !editRes.ok) {
            alert(SERVER_ERROR);
        } else {
            const { editedPost } = await editRes.json();
            setPosts((prev) => {
                const originalPost = prev.findIndex((otherPost) => otherPost._id === post._id);
                return prev.toSpliced(originalPost, 1, editedPost);
            });
        }

        setLoading(false);
        setIsEditMode(false);
    }

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
                    {post.author._id === user._id && (
                        <PostMenuButton
                            userID={user._id}
                            postID={post._id}
                            setPosts={setPosts}
                            setIsEditMode={setIsEditMode}
                        />
                    )}
                </div>

                {isEditMode ? (
                    <form id="edit-post" onSubmit={editPost}>
                        <textarea
                            name="body"
                            className={postStyles.editTextarea}
                            onInput={autoResizeTextarea}
                            defaultValue={post.body}
                            required
                        ></textarea>
                    </form>
                ) : (
                    <p>{post.body}</p>
                )}

                <div className={postStyles.bottom}>
                    <span className={postStyles.timestamp}>
                        {getRelativeTimestamp(post.timestamp)}
                    </span>

                    {post.isEdited && <span className={postStyles.edited}>(Edited)</span>}

                    <button className={postStyles.likeButton}>Like</button>

                    {isEditMode && (
                        <span className={postStyles.editFormButtons}>
                            <button
                                type="button"
                                form="edit-post"
                                onClick={() => setIsEditMode(false)}
                                className={buttonStyles.subtle}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="edit-post"
                                className={buttonStyles.bold}
                                disabled={loading}
                            >
                                {loading ? <Loading isInButton={true} /> : 'Save'}
                            </button>
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
