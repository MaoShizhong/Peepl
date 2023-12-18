import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCEPTED_FILE_TYPES, UPLOAD_SIZE_LIMIT_MB } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import {
    checkFileDetails,
    closeOnClickOutside,
    updateSelfPostsProfilePicture,
} from '../../helpers/util';
import buttonStyles from '../buttons/css/button.module.css';
import galleryStyles from './css/gallery.module.css';

export const UploadPhoto = forwardRef(function UploadPhoto(
    { user, setUser, uploadTarget, wallPosts, setWallPosts, setGallery, setOpenModal },
    modalRef
) {
    const [fileError, setFileError] = useState(null);

    const goTo = useNavigate();

    async function uploadPhoto(e) {
        e.preventDefault();

        const form = e.target;
        const file = form.photo.files[0];

        if (fileError) {
            alert('Invalid file type/size. Please try again with a valid file.');
            return;
        } else if (!file) {
            alert('No file chosen. Please choose a file to upload.');
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
            setGallery((prev) => [...prev, photo]);
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
                    Upload new {uploadTarget === 'gallery' ? 'photo to gallery' : 'profile picture'}
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

                <button className={buttonStyles.bold}>Upload</button>
            </form>
        </dialog>
    );
});
