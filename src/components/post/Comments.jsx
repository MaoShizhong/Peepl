import { Link, useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import {
    autoResizeTextarea,
    getFullNameFromDetails,
    getRelativeTimestamp,
} from '../../helpers/util';
import commentStyles from './css/comment.module.css';
import postStyles from './css/post.module.css';

export function Comments({ postID, comments }) {
    const { user } = useOutletContext();

    async function postComment(e) {
        e.preventDefault();
    }

    return (
        <div className={commentStyles.comments}>
            {comments.map((comment) => (
                <div key={comment._id} className={commentStyles.comment}>
                    <img
                        src={comment.author.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                        alt="comment profile picture"
                    />

                    <div className={commentStyles.content}>
                        <div className={commentStyles.top}>
                            <Link to={`/${comment.author.handle}`}>
                                {getFullNameFromDetails(comment.author.details)}
                            </Link>

                            {user._id === comment.author._id && (
                                <button className={commentStyles.delete}>Delete</button>
                            )}
                        </div>

                        <p>{comment.body}</p>

                        <div className={postStyles.timestamp}>
                            {getRelativeTimestamp(comment.timestamp)}
                        </div>
                    </div>
                </div>
            ))}

            <form onSubmit={postComment} className={commentStyles.reply}>
                <label htmlFor={`reply_${postID}`}>Reply:</label>
                <textarea
                    name="body"
                    id={`reply_${postID}`}
                    rows="1"
                    placeholder="Comment on this post..."
                    onInput={autoResizeTextarea}
                ></textarea>
                <button className={commentStyles.postComment}>Post</button>
            </form>
        </div>
    );
}
