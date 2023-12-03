import { Link } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { getFullNameFromDetails, getRelativeTimestamp } from '../../helpers/util';
import postStyles from './post.module.css';

export function Post({ post }) {
    // console.log(post);
    return (
        <article className={postStyles.post}>
            <img
                className={postStyles.profilePicture}
                src={post.author.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                alt="author profile picture"
            />

            <div className={postStyles.contents}>
                <Link to={`/${post.author.handle}`} state={{ _id: post.author._id }}>
                    {getFullNameFromDetails(post.author.details)}
                </Link>
                <p>{post.body}</p>
                <div>
                    <span className={postStyles.timestamp}>{getRelativeTimestamp(post.timestamp)}</span>
                    <button className={postStyles.likeButton}>Like</button>
                </div>
            </div>
        </article>
    );
}
