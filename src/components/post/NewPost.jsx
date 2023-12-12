import { getFirstName } from '../../helpers/util';
import { PostButton } from '../buttons/PostButton';
import postStyles from './css/post.module.css';

export function NewPost({ user, isOwnProfile, setPosts }) {
    const firstName = user.details ? user.details.firstName : getFirstName(user.name);
    const textareaPlaceholder = isOwnProfile
        ? `What's on your mind, ${firstName}?`
        : `Post something on ${firstName}'s wall!`;

    async function postToWall(e) {
        e.preventDefault();
    }

    return (
        <form className={postStyles.newPost} onSubmit={postToWall}>
            <textarea aria-label="new post" placeholder={textareaPlaceholder}></textarea>
            <PostButton />
        </form>
    );
}
