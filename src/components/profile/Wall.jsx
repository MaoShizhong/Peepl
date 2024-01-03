import { NewPost } from '../post/NewPost';
import { Post } from '../post/Post';
import wallStyles from './css/wall.module.css';

export function Wall({ user, posts, setPosts, isOwnProfile, isFriend }) {
    return (
        <>
            <div className="sr-only" aria-live="assertive">
                Now on wall
            </div>

            {(isFriend || isOwnProfile) && (
                <NewPost user={user} isOwnProfile={isOwnProfile} setPosts={setPosts} />
            )}

            <section className={wallStyles.wall}>
                <h2>{isOwnProfile ? 'Your Wall' : 'Wall'}</h2>

                {posts.map((post) => (
                    <Post key={post._id} post={post} setPosts={setPosts} />
                ))}

                {!posts.length && <div className={wallStyles.empty}>Nothing here!</div>}
            </section>
        </>
    );
}
