import { forwardRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE, SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { closeOnClickOutside, extractPhotoID } from '../../helpers/util';
import galleryStyles from './css/gallery.module.css';

export const Photo = forwardRef(function Photo(
    { photo, photoURL, setOpenPhotoModal, setGallery, isOwnProfile },
    modalRef
) {
    const isProfilePicture = !photo;
    const { user, setUser } = useOutletContext();
    const [loading, setLoading] = useState(false);

    async function deletePhoto() {
        setLoading(true);

        let endpoint;
        if (isProfilePicture) {
            endpoint = `/users/${user._id}/profile-picture`;
        } else {
            endpoint = `/users/${user._id}/gallery/${extractPhotoID(photoURL)}`;
        }

        const deleteRes = await fetchData(endpoint, 'DELETE');

        if (deleteRes instanceof Error || !deleteRes.ok) {
            alert(SERVER_ERROR);
        } else if (isProfilePicture) {
            setUser((prev) => {
                const clonedUser = structuredClone(prev);
                clonedUser.profilePicture = null;
                return clonedUser;
            });
            setOpenPhotoModal(false);
        } else {
            setGallery((prev) => prev.filter((galleryPhoto) => galleryPhoto._id !== photo._id));
            setOpenPhotoModal(false);
        }

        setLoading(false);
    }

    return (
        <dialog
            className={galleryStyles.modal}
            onClose={() => setOpenPhotoModal(false)}
            onClick={(e) => closeOnClickOutside(e, modalRef)}
            ref={modalRef}
            aria-modal
        >
            <img
                className={galleryStyles.photo}
                src={photoURL ?? DEFAULT_PROFILE_PICTURE}
                alt={isProfilePicture ? 'profile picture' : 'gallery photo'}
                // no height/width set as doing so interferes with dialog sizing
                // a visual reflow when the is loaded is not an issue given it is
                // only a single image in a dedicated modal
            />
        </dialog>
    );
});
