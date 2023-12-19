import { useState } from 'react';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { EditProfilePictureButton } from '../buttons/EditProfilePictureButton';
import profileStyles from './css/profile.module.css';

export function ProfilePicture({
    profileUser,
    isOwnProfile,
    setOpenPhotoModal,
    setOpenUploadModal,
    isMobileLayout,
}) {
    const [showEditProfilePictureBtn, setShowEditProfilePictureBtn] = useState(false);

    return (
        <div
            className={
                isMobileLayout
                    ? `${profileStyles.profilePicture} ${profileStyles.mobile}`
                    : profileStyles.profilePicture
            }
            onMouseEnter={() => setShowEditProfilePictureBtn(true)}
            onMouseLeave={() => setShowEditProfilePictureBtn(false)}
        >
            <img
                src={profileUser.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                alt="profile picture"
                onClick={() => setOpenPhotoModal(true)}
            />

            {isOwnProfile && showEditProfilePictureBtn && (
                <EditProfilePictureButton setOpenModal={setOpenUploadModal} />
            )}
        </div>
    );
}
