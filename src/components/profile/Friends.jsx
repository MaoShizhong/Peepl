import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { getFullNameFromDetails, sortFriends } from '../../helpers/util';
import { RemoveFriend } from '../buttons/RemoveFriend';
import { RespondFR } from '../buttons/RespondFR';
import friendsStyles from './css/friends.module.css';

export function Friends({ friendsList, setFriendsList, isOwnProfile }) {
    const sortedFriends = sortFriends(friendsList);

    const [acceptedFriends, setAcceptedFriends] = useState(
        sortedFriends.filter((friend) => friend.status === 'accepted')
    );
    const [incomingRequests, setIncomingRequests] = useState(
        sortedFriends.filter((friend) => friend.status === 'incoming')
    );
    const [requestedFriends, setRequestedFriends] = useState(
        sortedFriends.filter((friend) => friend.status === 'requested')
    );

    useEffect(() => {
        const sortedFriends = sortFriends(friendsList);
        setAcceptedFriends(sortedFriends.filter((friend) => friend.status === 'accepted'));
        setIncomingRequests(sortedFriends.filter((friend) => friend.status === 'incoming'));
        setRequestedFriends(sortedFriends.filter((friend) => friend.status === 'requested'));
    }, [friendsList]);

    return (
        <section className={friendsStyles.friendsList}>
            <div className={friendsStyles.heading}>
                <h2>Friends list</h2>
                <input
                    type="search"
                    placeholder="Filter friends list"
                    aria-label="search friends list"
                />
            </div>

            {isOwnProfile && incomingRequests.length > 0 && (
                <>
                    <div className={friendsStyles.friends}>
                        <h3>Incoming friend requests</h3>
                        {incomingRequests.map((request) => (
                            <div key={request.user._id} className={friendsStyles.friend}>
                                <img
                                    src={request.user.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                                    alt="friend profile picture thumbnail"
                                />

                                <Link to={`/${request.user.handle}`} reloadDocument>
                                    {getFullNameFromDetails(request.user)}
                                </Link>

                                <RespondFR
                                    action="accept"
                                    userID={request.user._id}
                                    setFriendsList={setFriendsList}
                                    page="friends"
                                />
                                <RespondFR
                                    action="reject"
                                    userID={request.user._id}
                                    setFriendsList={setFriendsList}
                                    page="friends"
                                />
                            </div>
                        ))}
                    </div>

                    <hr className={friendsStyles.separator} />
                </>
            )}

            {isOwnProfile && requestedFriends.length > 0 && (
                <>
                    <div className={friendsStyles.friends}>
                        <h3>Pending friend requests</h3>
                        {requestedFriends.map((request) => (
                            <div key={request.user._id} className={friendsStyles.friend}>
                                <img
                                    src={request.user.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                                    alt="friend profile picture thumbnail"
                                />

                                <Link to={`/${request.user.handle}`} reloadDocument>
                                    {getFullNameFromDetails(request.user)}
                                </Link>

                                <div>Pending...</div>
                            </div>
                        ))}
                    </div>

                    <hr className={friendsStyles.separator} />
                </>
            )}

            <div className={friendsStyles.friends}>
                <h3>Friends</h3>

                {acceptedFriends.map((friend) => (
                    <div key={friend.user._id} className={friendsStyles.friend}>
                        <img
                            src={friend.user.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                            alt="friend profile picture thumbnail"
                        />

                        <Link to={`/${friend.user.handle}`} reloadDocument>
                            {getFullNameFromDetails(friend.user)}
                        </Link>

                        <RemoveFriend userID={friend.user._id} />
                    </div>
                ))}
            </div>
        </section>
    );
}
