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
    return (
        <div
            className={
                isMobileLayout
                    ? `${profileStyles.profilePicture} ${profileStyles.mobile}`
                    : profileStyles.profilePicture
            }
        >
            <img
                src={profileUser.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                alt="profile picture"
                onClick={() => setOpenPhotoModal(true)}
            />

            {isOwnProfile && <EditProfilePictureButton setOpenModal={setOpenUploadModal} />}
        </div>
    );
}
