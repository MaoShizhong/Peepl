import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useMobileLayout, useProfile } from '../../helpers/hooks';
import { getEducationSummary, getEmploymentSummary, getLocationSummary } from '../../helpers/util';
import { AddFriend } from '../buttons/AddFriend';
import { RespondFR } from '../buttons/RespondFR';
import { Error404 } from '../error/Error404';
import { Loading } from '../loading/Loading';
import { Photo } from '../photos/Photo';
import { UploadPhoto } from '../photos/UploadPhoto';
import { Friends } from './Friends';
import { Gallery } from './Gallery';
import { ProfileInfo } from './ProfileInfo';
import { ProfilePicture } from './ProfilePicture';
import { Wall } from './Wall';
import profileStyles from './css/profile.module.css';
import wallStyles from './css/wall.module.css';

const tabs = ['Wall', 'Info', 'Gallery', 'Friends'];

export function Profile() {
    const { handle } = useParams();
    const { user } = useOutletContext();
    const { profileUser, setProfileUser, friendsList, wallPosts, setWallPosts, loading, error404 } =
        useProfile(handle);

    const isOwnProfile = handle === user.handle;
    const isFriend = Boolean(friendsList.find((friend) => friend.user._id === user._id));
    const isAcceptedFriend = Boolean(
        friendsList.find((friend) => friend.user._id === user._id && friend.status === 'accepted')
    );
    const isIncomingFriendRequest = Boolean(
        friendsList.find((friend) => friend.user._id === user._id && friend.status === 'requested')
    );

    const [activeTab, setActiveTab] = useState('Wall');
    const [openPhotoModal, setOpenPhotoModal] = useState(false);
    const [openUploadModal, setOpenUploadModal] = useState(false);

    const isMobileLayout = useMobileLayout();
    const photoRef = useRef();
    const uploadRef = useRef();

    useEffect(() => {
        if (photoRef.current && openPhotoModal) photoRef.current.showModal();
        if (uploadRef.current && openUploadModal) uploadRef.current.showModal();
    }, [openPhotoModal, openUploadModal]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : error404 ? (
                <Error404 resource={`User "${handle}"`} />
            ) : (
                <main className={profileStyles.main}>
                    {!isMobileLayout && (
                        <div className={profileStyles.side}>
                            <ProfilePicture
                                profileUser={profileUser}
                                isOwnProfile={isOwnProfile}
                                setOpenPhotoModal={setOpenPhotoModal}
                                setOpenUploadModal={setOpenUploadModal}
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
                    )}

                    <div className={profileStyles.content}>
                        {isMobileLayout && (
                            <nav className={`${profileStyles.tabs} ${profileStyles.mobile}`}>
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
                        )}

                        <div className={profileStyles.top}>
                            {isMobileLayout && (
                                <ProfilePicture
                                    profileUser={profileUser}
                                    isOwnProfile={isOwnProfile}
                                    setOpenPhotoModal={setOpenPhotoModal}
                                    setOpenUploadModal={setOpenUploadModal}
                                    isMobileLayout={true}
                                />
                            )}
                            <div>
                                <div>
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

                                {activeTab === 'Wall' && (
                                    <div className={wallStyles.summary}>
                                        {(profileUser.city || profileUser.country) && (
                                            <div className={wallStyles.location}>
                                                {getLocationSummary(
                                                    profileUser.city,
                                                    profileUser.country
                                                )}
                                            </div>
                                        )}

                                        {profileUser.employment &&
                                            profileUser.employment.length > 0 && (
                                                <div className={wallStyles.employment}>
                                                    {getEmploymentSummary(
                                                        profileUser.employment[0]
                                                    )}
                                                </div>
                                            )}

                                        {profileUser.education &&
                                            profileUser.education.length > 0 && (
                                                <div className={wallStyles.education}>
                                                    {getEducationSummary(profileUser.education[0])}
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {activeTab === 'Wall' ? (
                            <Wall
                                user={profileUser}
                                posts={wallPosts}
                                setPosts={setWallPosts}
                                isOwnProfile={isOwnProfile}
                                isFriend={isAcceptedFriend}
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

                    {openPhotoModal && (
                        <Photo
                            photo={profileUser.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                            setOpenPhotoModal={setOpenPhotoModal}
                            ref={photoRef}
                        />
                    )}

                    {isOwnProfile && openUploadModal && (
                        <UploadPhoto
                            user={profileUser}
                            setUser={setProfileUser}
                            wallPosts={wallPosts}
                            setWallPosts={setWallPosts}
                            setOpenModal={setOpenUploadModal}
                            ref={uploadRef}
                        />
                    )}
                </main>
            )}
        </>
    );
}
