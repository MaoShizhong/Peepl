import { useState } from 'react';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useProfile } from '../../helpers/hooks';
import { Loading } from '../loading/Loading';
import { ProfileInfo } from './ProfileInfo';
import { Wall } from './Wall';
import profileStyles from './profile.module.css';

export function Profile() {
    const { user } = useOutletContext();
    const { _id } = useLocation().state;
    const { profileUser, friendsList, wallPosts, loading } = useProfile(_id);

    const [activeTab, setActiveTab] = useState('wall');

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <main className={profileStyles.main}>
                    <div className={profileStyles.side}>
                        <img
                            src={profileUser.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                            alt="profile picture"
                        />
                        <nav className={profileStyles.tabs}>
                            <button onClick={() => setActiveTab('wall')}>Wall</button>
                            <button onClick={() => setActiveTab('info')}>Info</button>
                            <button onClick={() => setActiveTab('gallery')}>Gallery</button>
                        </nav>
                        <section className={profileStyles.friendsList}>
                            <h2>Friends list</h2>
                            <Link to="friends" state={{ friends: friendsList }}>
                                See all friends
                            </Link>
                            <div className={profileStyles.friends}>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </section>
                    </div>

                    <div>
                        <h1 className={profileStyles.profileName}>
                            {profileUser.name} <span>({profileUser.handle})</span>
                        </h1>

                        {activeTab === 'wall' ? (
                            <Wall user={profileUser} posts={wallPosts} />
                        ) : activeTab === 'info' ? (
                            <ProfileInfo user={profileUser} />
                        ) : (
                            <div>Gallery</div>
                        )}
                    </div>
                </main>
            )}
        </>
    );
}
