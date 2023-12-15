import { useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useFeed } from '../../helpers/hooks';
import { Loading } from '../loading/Loading';
import { NewPost } from '../post/NewPost';
import { Post } from '../post/Post';
import feedStyles from './css/feed.module.css';

export function Feed() {
    const { user } = useOutletContext();
    const { posts, setPosts, loading } = useFeed(user._id);

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

                <div className={feedStyles.posts}>
                    {loading ? (
                        <Loading text="Fetching feed" />
                    ) : posts.length ? (
                        posts.map((post) => <Post key={post._id} post={post} setPosts={setPosts} />)
                    ) : (
                        <div className={feedStyles.empty}>Nothing here!</div>
                    )}
                </div>
            </section>
        </main>
    );
}
