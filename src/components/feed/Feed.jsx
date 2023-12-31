import { useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useFeed, useSSE } from '../../helpers/hooks';
import { Loading } from '../loading/Loading';
import { NewPost } from '../post/NewPost';
import { Post } from '../post/Post';
import feedStyles from './css/feed.module.css';

export function Feed() {
    const { user } = useOutletContext();
    const { posts, setPosts, loading } = useFeed(user._id);
    const { notifications: newFeedPosts, setNotifications: setNewFeedPosts } = useSSE(
        `/notifications/feed-updates`
    );

    function refreshFeed() {
        setPosts((prev) => [...newFeedPosts, ...prev]);
        setNewFeedPosts([]);

        const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
        scrollTo({ top: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
    }

    return (
        <main className={feedStyles.main}>
            <section className={feedStyles.feed}>
                <div className={feedStyles.heading}>
                    <img
                        src={user.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                        alt="your profile picture"
                    />
                    <h1>Your feed</h1>
                </div>

                <NewPost user={user} isOwnProfile={true} setPosts={setPosts} />

                {newFeedPosts.length > 0 && (
                    <button className={feedStyles.update} onClick={refreshFeed}>
                        {newFeedPosts.length} new {newFeedPosts.length === 1 ? 'post' : 'posts'} -
                        click here to refresh
                    </button>
                )}

                <div className={feedStyles.posts}>
                    {loading ? (
                        <Loading text="Fetching feed" />
                    ) : !posts.length ? (
                        <div className={feedStyles.empty}>Nothing here!</div>
                    ) : (
                        posts.map((post) => <Post key={post._id} post={post} setPosts={setPosts} />)
                    )}
                </div>
            </section>
        </main>
    );
}
