import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { Loading } from '../loading/Loading';
import buttonStyles from './css/button.module.css';

export function RespondFR({ userID, action, setFriendsList, page }) {
    const { user } = useOutletContext();
    const [loading, setLoading] = useState(false);

    async function respondToFriendRequest() {
        setLoading(true);

        const respondRes = await fetchData(
            `/users/${user._id}/friends?action=${action}&incoming=${userID}`,
            'PUT'
        );

        if (respondRes instanceof Error || !respondRes.ok) {
            alert(SERVER_ERROR);
        } else if (action === 'accept') {
            let findCb;
            if (page === 'friends') {
                findCb = (request) => request.user._id === userID;
            } else if (page === 'profile') {
                findCb = (friend) => friend.user._id === user._id;
            } else {
                findCb = (friend) => friend._id === userID;
            }

            setFriendsList((prev) => {
                const clonedList = structuredClone(prev);
                const target = clonedList.find(findCb);
                target.status = 'accepted';
                return clonedList;
            });
        } else {
            let setCb;
            if (page === 'friends') {
                setCb = (prev) => prev.filter((request) => request.user._id !== userID);
            } else if (page === 'profile') {
                setCb = (prev) => prev.filter((friend) => friend.user._id !== user._id);
            } else {
                setCb = (prev) => {
                    const clonedList = structuredClone(prev);
                    const target = clonedList.find((result) => result._id === userID);
                    target.status = null;
                    return clonedList;
                };
            }

            setFriendsList(setCb);
        }

        setLoading(false);
    }

    return (
        <button
            onClick={respondToFriendRequest}
            className={buttonStyles[action === 'accept' ? 'bold' : 'subtle']}
            disabled={loading}
        >
            {loading ? <Loading isInButton={true} /> : action === 'accept' ? 'Accept' : 'Decline'}
        </button>
    );
}
