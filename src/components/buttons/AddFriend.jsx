import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { Loading } from '../loading/Loading';
import buttonStyles from './css/button.module.css';

export function AddFriend({ userID, setProfile, setUserList }) {
    const { user } = useOutletContext();
    const [loading, setLoading] = useState(false);

    async function sendFriendRequest() {
        setLoading(true);

        const addRes = await fetchData(`/users/${user._id}/friends?requested=${userID}`, 'POST');

        if (addRes instanceof Error || !addRes.ok) {
            alert(SERVER_ERROR);
        } else if (setProfile) {
            setProfile((prev) => [...prev, { user: { _id: user._id }, status: 'incoming' }]);
        } else if (setUserList) {
            setUserList((prev) => {
                const clonedList = structuredClone(prev);
                const addedUser = clonedList.find((user) => user._id === userID);
                addedUser.friendStatus = 'requested';
                return clonedList;
            });
        }

        setLoading(false);
    }

    return (
        <button onClick={sendFriendRequest} className={buttonStyles.bold} disabled={loading}>
            {loading ? <Loading isInButton={true} /> : 'Add friend'}
        </button>
    );
}
