import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { Loading } from '../loading/Loading';
import buttonStyles from './css/button.module.css';

export function RespondFR({ userID, action, setFriendsList, page }) {
    const { user, setIncomingFriendRequests } = useOutletContext();
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
            let arrayFindCallback;
            if (page === 'friends') {
                arrayFindCallback = (request) => request.user._id === userID;
            } else if (page === 'profile') {
                arrayFindCallback = (friend) => friend.user._id === user._id;
            } else {
                arrayFindCallback = (friend) => friend._id === userID;
            }

            setFriendsList((prev) => {
                const clonedList = structuredClone(prev);
                const target = clonedList.find(arrayFindCallback);
                target.status = 'accepted';
                return clonedList;
            });
            setIncomingFriendRequests((prev) =>
                prev.filter((request) => request._id !== userID)
            );
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
            setIncomingFriendRequests((prev) => prev.filter((request) => request._id !== userID));
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
