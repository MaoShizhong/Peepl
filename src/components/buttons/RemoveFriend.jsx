import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { Loading } from '../loading/Loading';
import buttonStyles from './css/button.module.css';

export function RemoveFriend({ userID, setFriendsList, page }) {
    const { user } = useOutletContext();
    const [loading, setLoading] = useState(false);

    async function removeFriend() {
        setLoading(true);

        const removeRes = await fetchData(`/users/${user._id}/friends/${userID}`, 'DELETE');

        if (removeRes instanceof Error || !removeRes.ok) {
            alert(SERVER_ERROR);
        } else {
            let setFriendsListCallback;
            if (page === 'friends') {
                setFriendsListCallback = (prev) =>
                    prev.filter((request) => request.user._id !== userID);
            } else if (page === 'profile') {
                setFriendsListCallback = (prev) =>
                    prev.filter((friend) => friend.user._id !== user._id);
            } else {
                setFriendsListCallback = (prev) => {
                    const clonedList = structuredClone(prev);
                    const target = clonedList.find((result) => result._id === userID);
                    target.status = null;
                    return clonedList;
                };
            }

            setFriendsList(setFriendsListCallback);
        }

        setLoading(false);
    }

    return (
        <button onClick={removeFriend} className={buttonStyles.subtle} disabled={loading}>
            {loading ? <Loading isInButton={true} /> : 'Remove'}
        </button>
    );
}
