import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCloseDropdown } from '../../helpers/hooks';
import { getFullNameFromDetails } from '../../helpers/util';
import dropdownStyles from './css/dropdown.module.css';

export function FriendRequests({ setIsOpen, button, friendRequests }) {
    const dropdownRef = useRef(null);

    useCloseDropdown(dropdownRef, button, setIsOpen);

    return (
        <div
            className={dropdownStyles.dropdown}
            id="friend-requests-dropdown"
            aria-label="friend requests dropdown"
            onClick={() => setIsOpen(false)}
            ref={dropdownRef}
        >
            {friendRequests.length ? (
                friendRequests.map((request) => (
                    <Link
                        key={request._id}
                        to={`/${request.handle}`}
                        className={dropdownStyles.friendRequest}
                    >
                        <img
                            src={request.profilePicture}
                            height="40"
                            width="40"
                            alt="friend request profile picture"
                        />

                        <p className={dropdownStyles.text}>
                            <span>{getFullNameFromDetails(request.details)}</span> sent you a friend
                            request.
                        </p>
                    </Link>
                ))
            ) : (
                <p className={`${dropdownStyles.empty} ${dropdownStyles.text}`}>
                    No incoming friend requests
                </p>
            )}
        </div>
    );
}
