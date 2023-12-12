import { getEducationSummary, getEmploymentSummary, getLocationSummary } from '../../helpers/util';
import { NewPost } from '../post/NewPost';
import { Post } from '../post/Post';
import wallStyles from './css/wall.module.css';

export function Wall({ user, posts, isOwnProfile }) {
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

            <NewPost user={user} isOwnProfile={isOwnProfile} />

            <section className={wallStyles.wall}>
                <h2>Wall</h2>

                {posts.map((post) => (
                    <Post key={post._id} post={post} />
                ))}
            </section>
        </>
    );
}
