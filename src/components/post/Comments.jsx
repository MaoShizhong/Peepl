import { useState } from 'react';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { autoResizeTextarea } from '../../helpers/util';
import { PostButton } from '../buttons/PostButton';
import { Comment } from './Comment';
import commentStyles from './css/comment.module.css';

export function Comments({ postID, comments, isFriend }) {
    const [postComments, setPostComments] = useState(comments ?? []);
    const [loading, setLoading] = useState(false);
    const [commentError, setCommentError] = useState(null);

    async function postComment(e) {
        e.preventDefault();
        setCommentError(null);
        setLoading(true);
        const textarea = e.target.body;

        const commentRes = await fetchData(`/posts/${postID}/comments`, 'POST', {
            data: { body: textarea.value },
            urlEncoded: true,
        });

        if (commentRes instanceof Error) {
            alert(SERVER_ERROR);
        } else if (!commentRes.ok) {
            const { error } = await commentRes.json();
            setCommentError(error);
        } else {
            const { newComment } = await commentRes.json();
            setPostComments((prev) => [...prev, newComment]);
            textarea.value = '';
        }

        setLoading(false);
    }

    return (
        <div className={commentStyles.comments}>
            {postComments.map((comment) => (
                <Comment
                    key={comment._id}
                    postID={postID}
                    comment={comment}
                    setComments={setPostComments}
                />
            ))}

            {isFriend && (
                <div className={commentStyles.reply}>
                    <form onSubmit={postComment}>
                        <label htmlFor={`reply_${postID}`}>Reply:</label>
                        <textarea
                            name="body"
                            id={`reply_${postID}`}
                            rows="1"
                            maxLength={2000}
                            placeholder="Comment on this post..."
                            onInput={(e) => {
                                autoResizeTextarea(e);
                                setCommentError(null);
                            }}
                            required
                        ></textarea>

                        <PostButton contentType="comment" loading={loading} />
                    </form>

                    {commentError && <p className={commentStyles.error}>{commentError}</p>}
                </div>
            )}
        </div>
    );
}
