import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { getFullNameFromDetails, sortFriends } from '../../helpers/util';
import { RemoveFriend } from '../buttons/RemoveFriend';
import friendsStyles from './css/friends.module.css';

export function Friends({ friendsList }) {
    const [friends, setFriends] = useState(sortFriends(friendsList));

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

            <div className={friendsStyles.friends}>
                {friends.map((friend) => (
                    <div key={friend.user._id} className={friendsStyles.friend}>
                        <img
                            src={friend.user.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                            alt="friend profile picture thumbnail"
                        />

                        <Link to={`/${friend.user.handle}`} reloadDocument>
                            {getFullNameFromDetails(friend.user)}
                        </Link>

                        {friend.status === 'accepted' ? (
                            <RemoveFriend userID={friend.user._id} />
                        ) : (
                            <button>Pending...</button>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
