import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE, SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { getFullNameFromDetails, getRelativeTimestamp } from '../../helpers/util';
import { Loading } from '../loading/Loading';
import commentStyles from './css/comment.module.css';
import postStyles from './css/post.module.css';

export function Comment({ postID, comment, setComments }) {
    const { user } = useOutletContext();
    const [loading, setLoading] = useState(false);

    async function deleteComment() {
        setLoading(true);

        const deleteRes = await fetchData(
            `/posts/${postID}/comments/${comment._id}?userID=${user._id}`,
            'DELETE'
        );

        if (deleteRes instanceof Error || !deleteRes.ok) {
            alert(SERVER_ERROR);
        } else {
            setComments((prev) => prev.filter((postComment) => postComment._id !== comment._id));
        }

        setLoading(false);
    }

    return (
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
                        <button
                            onClick={deleteComment}
                            className={commentStyles.delete}
                            disabled={loading}
                        >
                            {loading ? <Loading isInButton={true} /> : 'Delete'}
                        </button>
                    )}
                </div>

                <p>{comment.body}</p>

                <div className={postStyles.timestamp}>
                    {getRelativeTimestamp(comment.timestamp)}
                </div>
            </div>
        </div>
    );
}
