import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCEPTED_FILE_TYPES, SERVER_ERROR, UPLOAD_SIZE_LIMIT_MB } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import {
    checkFileDetails,
    closeOnClickOutside,
    updateSelfPostsProfilePicture,
} from '../../helpers/util';
import buttonStyles from '../buttons/css/button.module.css';
import { Loading } from '../loading/Loading';
import galleryStyles from './css/gallery.module.css';

export const UploadPhoto = forwardRef(function UploadPhoto(
    { user, setUser, uploadTarget, wallPosts, setWallPosts, setGallery, setOpenModal },
    modalRef
) {
    const [fileError, setFileError] = useState(null);
    const [loading, setLoading] = useState(false);

    const goTo = useNavigate();

    async function uploadPhoto(e) {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const file = form.photo.files[0];

        if (fileError) {
            alert('Invalid file type/size. Please try again with a valid file.');
            setLoading(false);
            return;
        } else if (!file) {
            alert('No file chosen. Please choose a file to upload.');
            setLoading(false);
            return;
        }

        let endpoint, method;
        const formData = new FormData();

        if (uploadTarget === 'gallery') {
            formData.append('photo', file);
            endpoint = `/users/${user._id}/gallery`;
            method = 'POST';
        } else {
            formData.append('profilePicture', file);
            endpoint = `/users/${user._id}/profile-picture`;
            method = 'PUT';
        }

        const uploadRes = await fetchData(endpoint, method, {
            data: formData,
        });

        if (uploadRes instanceof Error) {
            goTo('/error');
        } else if (!uploadRes.ok) {
            console.error(await uploadRes.json());
        } else if (uploadTarget === 'gallery') {
            const { photo } = await uploadRes.json();
            setGallery((prev) => [photo, ...prev]);
            setOpenModal(false);
        } else {
            const { profilePicture: newProfilePicture } = await uploadRes.json();
            const newUser = structuredClone(user);
            newUser.profilePicture = newProfilePicture;

            setUser(newUser);
            setOpenModal(false);

            // wall posts use profile.author.profilePicture, not profileUser.profilePicture
            // without this, wall posts only update profile picture upon refresh/re-fetch
            updateSelfPostsProfilePicture(user._id, newProfilePicture, wallPosts, setWallPosts);
        }

        setLoading(false);
    }

    async function removeProfilePicture() {
        setLoading(true);

        const removeRes = await fetchData(`/users/${user._id}/profile-picture`, 'DELETE');

        if (removeRes instanceof Error) {
            alert(SERVER_ERROR);
        } else if (!removeRes.ok) {
            alert(SERVER_ERROR);
            console.error(await removeRes.json());
        } else {
            setUser((prev) => {
                const clonedUser = structuredClone(prev);
                clonedUser.profilePicture = null;
                return clonedUser;
            });
            setOpenModal(false);

            // wall posts use profile.author.profilePicture, not profileUser.profilePicture
            // without this, wall posts only update profile picture upon refresh/re-fetch
            updateSelfPostsProfilePicture(user._id, null, wallPosts, setWallPosts);
        }

        setLoading(false);
    }

    return (
        <dialog
            className={galleryStyles.modal}
            onClose={() => setOpenModal(false)}
            onClick={(e) => closeOnClickOutside(e, modalRef)}
            ref={modalRef}
            aria-modal
        >
            <form className={galleryStyles.form} onSubmit={uploadPhoto}>
                <label htmlFor="file">
                    {uploadTarget === 'gallery'
                        ? 'Upload new photo to gallery'
                        : 'Change profile picture'}
                </label>
                <input
                    id="file"
                    name="photo"
                    type="file"
                    aria-label={`upload new ${
                        uploadTarget === 'gallery' ? 'gallery photo' : 'profile picture'
                    }`}
                    accept=".jpg, .jpeg, .png, .webp"
                    onChange={(e) => checkFileDetails(e, setFileError)}
                    required
                />

                <div className={galleryStyles.requirements}>
                    <p>Accepted file types: {ACCEPTED_FILE_TYPES.join(' / ')}</p>
                    <p>Max file size: {UPLOAD_SIZE_LIMIT_MB} MB</p>
                </div>

                {fileError && <p className={galleryStyles.error}>{fileError}</p>}

                <div className={galleryStyles.btns}>
                    <button type="submit" className={buttonStyles.bold} disabled={loading}>
                        {loading ? <Loading isInButton={true} /> : 'Upload'}
                    </button>

                    {user.profilePicture && (
                        <button
                            type="button"
                            className={buttonStyles.subtle}
                            onClick={removeProfilePicture}
                            disabled={loading}
                        >
                            {loading ? <Loading isInButton={true} /> : 'Remove'}
                        </button>
                    )}
                </div>
            </form>
        </dialog>
    );
});
