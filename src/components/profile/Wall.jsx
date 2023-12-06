import {
    getEducationSummary,
    getEmploymentSummary,
    getFirstName,
    getLocationSummary,
} from '../../helpers/util';
import { PostButton } from '../buttons/PostButton';
import { Post } from '../post/Post';
import wallStyles from './css/wall.module.css';

export function Wall({ user, posts }) {
    console.log(user);
    async function postToWall(e) {
        e.preventDefault();
    }

    return (
        <>
            <div className={wallStyles.summary}>
                {(user.city || user.country) && (
                    <div className={wallStyles.location}>
                        {getLocationSummary(user.city, user.country)}
                    </div>
                )}

                {user.employment && user.employment.length > 0 && (
                    <div className={wallStyles.employment}>
                        {getEmploymentSummary(user.employment[0])}
                    </div>
                )}

                {user.education && user.education.length > 0 && (
                    <div className={wallStyles.education}>
                        {getEducationSummary(user.education[0])}
                    </div>
                )}
            </div>

            <form className={wallStyles.newPost} onSubmit={postToWall}>
                <textarea
                    aria-label="new post"
                    placeholder={`What's on your mind, ${getFirstName(user.name)}?`}
                ></textarea>
                <PostButton />
            </form>

            <section className={wallStyles.wall}>
                <h2>Wall</h2>

                {posts.map((post) => (
                    <Post key={post._id} post={post} />
                ))}
            </section>
        </>
    );
}
