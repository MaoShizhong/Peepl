import { useState } from 'react';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { autoResizeTextarea, getFirstName } from '../../helpers/util';
import { PostButton } from '../buttons/PostButton';
import postStyles from './css/post.module.css';

export function NewPost({ user, isOwnProfile, setPosts }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const firstName = user.details ? user.details.firstName : getFirstName(user.name);
    const textareaPlaceholder = isOwnProfile
        ? `What's on your mind, ${firstName}?`
        : `Post something on ${firstName}'s wall!`;

    async function postToWall(e) {
        e.preventDefault();
        setLoading(true);

        const textArea = e.target.body;
        const form = new FormData();
        form.append('body', textArea.value);

        const postRes = await fetchData(`/users/${user._id}/posts`, 'POST', {
            data: form,
            urlEncoded: true,
        });

        if (postRes instanceof Error) {
            alert(SERVER_ERROR);
        } else if (!postRes.ok) {
            const { error } = await postRes.json();
            setError(error);
        } else {
            const { post } = await postRes.json();
            setPosts((posts) => [post, ...posts]);
            setError(null);
            textArea.value = '';
        }

        setLoading(false);
    }

    return (
        <form className={postStyles.newPost} onSubmit={postToWall}>
            <textarea
                name="body"
                aria-label="new post"
                placeholder={textareaPlaceholder}
                onInput={autoResizeTextarea}
                required
            ></textarea>

            {error && <p className={postStyles.error}>{error}</p>}

            <PostButton contentType="new wall post" loading={loading} />
        </form>
    );
}
