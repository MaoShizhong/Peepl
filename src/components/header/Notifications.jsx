import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useCloseDropdown } from '../../helpers/hooks';
import { getFullNameFromDetails, getPostPreview, getRelativeTimestamp } from '../../helpers/util';
import dropdownStyles from './css/dropdown.module.css';

export function Notifications({ setIsOpen, button, ownHandle, notifications, setNotifications }) {
    const dropdownRef = useRef(null);
    const { handle: currentPage } = useParams();

    useCloseDropdown(dropdownRef, button, setIsOpen);

    return (
        <div
            id="notifications-dropdown"
            aria-label="notifications dropdown"
            className={dropdownStyles.dropdown}
            ref={dropdownRef}
        >
            {!notifications.length ? (
                <p className={`${dropdownStyles.empty} ${dropdownStyles.text}`}>No notifications</p>
            ) : (
                notifications.map((notification) => (
                    <div key={notification._id} className={dropdownStyles.notification}>
                        <Link
                            to={`/${ownHandle}`}
                            reloadDocument={currentPage === ownHandle}
                            onClick={() => setNotifications([])}
                        >
                            <img
                                src={notification.author.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                                height="40"
                                width="40"
                                alt="notification profile picture"
                            />
                            <div>
                                <p className={dropdownStyles.text}>
                                    <span>
                                        {getFullNameFromDetails(notification.author.details)}
                                    </span>{' '}
                                    wrote on your wall:
                                </p>
                                <p className={dropdownStyles.preview}>
                                    {getPostPreview(notification.body)}
                                </p>
                                <p className={dropdownStyles.timestamp}>
                                    {getRelativeTimestamp(notification.timestamp)}
                                </p>
                            </div>
                        </Link>

                        <button
                            className={dropdownStyles.delete}
                            onClick={() =>
                                setNotifications((prev) =>
                                    prev.filter((entry) => entry._id !== notification._id)
                                )
                            }
                        >
                            {'\u2715'}
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
