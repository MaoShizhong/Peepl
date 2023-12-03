import { getFirstName } from '../../helpers/util';
import { Post } from '../post/Post';
import wallStyles from './wall.module.css';

export function Wall({ user, posts }) {
    return (
        <>
            <form className={wallStyles.newPost}>
                <textarea
                    aria-label="new post"
                    placeholder={`What's on your mind, ${getFirstName(user.name)}?`}
                ></textarea>
                <button>Post</button>
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
