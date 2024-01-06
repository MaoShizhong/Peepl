import { usePaginatedFetch } from '../../helpers/hooks';
import { Loading } from '../loading/Loading';
import { NewPost } from '../post/NewPost';
import { Post } from '../post/Post';
import wallStyles from './css/wall.module.css';

export function Wall({
    user,
    posts,
    setPosts,
    hasMoreWallPosts,
    setWallPostPageToFetch,
    loading,
    isOwnProfile,
    isFriend,
}) {
    usePaginatedFetch(hasMoreWallPosts, setWallPostPageToFetch, loading);

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

                {!posts.length ? (
                    <div className={wallStyles.empty}>Nothing here!</div>
                ) : (
                    <>
                        {posts.map((post) => (
                            <Post key={post._id} post={post} setPosts={setPosts} isFriend={isFriend} />
                        ))}

                        {loading && (
                            <div className={wallStyles.fetchMore}>
                                <Loading isInButton={true} />
                            </div>
                        )}

                        {!hasMoreWallPosts && <p className={wallStyles.end}>No more wall posts</p>}
                    </>
                )}
            </section>
        </>
    );
}
