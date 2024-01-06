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
import { Comments } from './Comments';
import { ThumbsUp } from './ThumbsUp';
import postStyles from './css/post.module.css';

export function Post({ post, setPosts, showReplyBox }) {
    const { user } = useOutletContext();
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingLike, setLoadingLike] = useState(false);

    async function editPost(e) {
        e.preventDefault();
        setLoading(true);

        const textarea = e.target.body;
        const form = new FormData();
        form.append('body', textarea.value);

        const editRes = await fetchData(`/posts/${post._id}?userID=${user._id}`, 'PUT', {
            data: form,
            urlEncoded: true,
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

    async function toggleLikePost() {
        setLoadingLike(true);

        const likeRes = await fetchData(`/posts/${post._id}/likes`, 'PUT');

        if (likeRes instanceof Error || !likeRes.ok) {
            alert(SERVER_ERROR);
        } else {
            const { newLikes } = await likeRes.json();
            setPosts((prev) => {
                const clonedPosts = structuredClone(prev);
                const editedPost = clonedPosts.find((clonedPost) => clonedPost._id === post._id);
                editedPost.likes = newLikes;
                return clonedPosts;
            });
        }

        setLoadingLike(false);
    }

    return (
        <article className={postStyles.post}>
            <img
                className={postStyles.profilePicture}
                src={post.author.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                alt={`profile picture for post by ${getFullNameFromDetails(post.author.details)}`}
            />

            <div className={postStyles.contents}>
                <div className={postStyles.top}>
                    <Link
                        to={`/${post.author.handle}`}
                        state={post.author.handle}
                        aria-label={
                            user._id === post.author._id
                                ? 'Link to your profile'
                                : `Link to ${getFullNameFromDetails(post.author.details)}'s profile`
                        }
                    >
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

                    {post.author._id !== user._id && showReplyBox && (
                        <button
                            className={postStyles.likeButton}
                            onClick={toggleLikePost}
                            aria-label={post.likes.includes(user._id) ? 'Unlike post' : 'Like post'}
                            disabled={loadingLike}
                        >
                            {post.likes.includes(user._id) ? 'Unlike' : 'Like'}
                        </button>
                    )}

                    {post.likes.length > 0 && (
                        <>
                            <span
                                className={postStyles.likes}
                                aria-label={`This post has ${post.likes.length} ${
                                    post.likes.length === 1 ? 'like' : 'likes'
                                }`}
                            >
                                {post.likes.length}
                            </span>
                            <ThumbsUp />
                        </>
                    )}

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

                <Comments postID={post._id} comments={post.comments} showReplyBox={showReplyBox} />
            </div>
        </article>
    );
}
