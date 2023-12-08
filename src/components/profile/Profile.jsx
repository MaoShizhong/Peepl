import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useProfile } from '../../helpers/hooks';
import { AddFriend } from '../buttons/AddFriend';
import { RespondFR } from '../buttons/RespondFR';
import { Error404 } from '../error/Error404';
import { Loading } from '../loading/Loading';
import { Friends } from './Friends';
import { Gallery } from './Gallery';
import { ProfileInfo } from './ProfileInfo';
import { Wall } from './Wall';
import profileStyles from './css/profile.module.css';

const tabs = ['Wall', 'Info', 'Gallery', 'Friends'];

export function Profile() {
    // remove leading '/'
    const handle = window.location.pathname.slice(1);
    const { user } = useOutletContext();
    const { profileUser, friendsList, wallPosts, loading, error404 } = useProfile(handle);

    const isOwnProfile = handle === user.handle;
    const isFriend = Boolean(friendsList.find((friend) => friend.user._id === user._id));
    const isIncomingFriendRequest = Boolean(
        friendsList.find((friend) => friend.user._id === user._id && friend.status === 'requested')
    );

    const [activeTab, setActiveTab] = useState('Wall');

    return (
        <>
            {loading ? (
                <Loading />
            ) : error404 ? (
                <Error404 />
            ) : (
                <main className={profileStyles.main}>
                    <div className={profileStyles.side}>
                        <img
                            src={profileUser.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                            alt="profile picture"
                        />
                        <nav className={profileStyles.tabs}>
                            {tabs.map((tab, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(tab)}
                                    className={activeTab === tab ? profileStyles.activeTab : ''}
                                >
                                    {tab}
                                    {tab === 'Friends'
                                        ? ` (${
                                              friendsList.filter(
                                                  (friend) => friend.status === 'accepted'
                                              ).length
                                          })`
                                        : ''}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <div className={profileStyles.top}>
                            <h1 className={profileStyles.profileName}>
                                {profileUser.name} <span>({profileUser.handle})</span>
                            </h1>

                            {isIncomingFriendRequest ? (
                                <div className={profileStyles.respondButtons}>
                                    <RespondFR action="accept" userID={profileUser._id} />
                                    <RespondFR action="decline" userID={profileUser._id} />
                                </div>
                            ) : !isOwnProfile && !isFriend ? (
                                <AddFriend userID={profileUser._id} />
                            ) : null}
                        </div>

                        {activeTab === 'Wall' ? (
                            <Wall
                                user={profileUser}
                                posts={wallPosts}
                                isOwnProfile={isOwnProfile}
                            />
                        ) : activeTab === 'Info' ? (
                            <ProfileInfo user={profileUser} isOwnProfile={isOwnProfile} />
                        ) : activeTab === 'Gallery' ? (
                            <Gallery
                                userID={profileUser._id}
                                isHidden={profileUser.galleryIsHidden}
                                isOwnProfile={isOwnProfile}
                            />
                        ) : (
                            <Friends friendsList={friendsList} isOwnProfile={isOwnProfile} />
                        )}
                    </div>
                </main>
            )}
        </>
    );
}
