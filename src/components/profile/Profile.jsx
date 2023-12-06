import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useProfile } from '../../helpers/hooks';
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

    const [activeTab, setActiveTab] = useState('Wall');

    console.log(user, profileUser);

    useEffect(() => {
        setActiveTab('Wall');
    }, [profileUser]);

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
                                    {tab === 'Friends' ? ` (${friendsList.length})` : ''}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h1 className={profileStyles.profileName}>
                            {profileUser.name} <span>({profileUser.handle})</span>
                        </h1>

                        {activeTab === 'Wall' ? (
                            <Wall user={profileUser} posts={wallPosts} />
                        ) : activeTab === 'Info' ? (
                            <ProfileInfo user={profileUser} />
                        ) : activeTab === 'Gallery' ? (
                            <Gallery
                                userID={profileUser._id}
                                isHidden={profileUser.galleryIsHidden}
                                isOwnProfile={user._id === profileUser._id}
                            />
                        ) : (
                            <Friends friendsList={friendsList} />
                        )}
                    </div>
                </main>
            )}
        </>
    );
}
