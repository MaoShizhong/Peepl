import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ACCEPTED_FILE_TYPES,
    UPLOAD_SIZE_LIMIT,
    UPLOAD_SIZE_LIMIT_MB,
} from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { closeOnClickOutside, updateSelfPostsProfilePicture } from '../../helpers/util';
import buttonStyles from '../buttons/css/button.module.css';
import galleryStyles from './css/gallery.module.css';

export const UploadPhoto = forwardRef(function UploadPhoto(
    { user, setUser, wallPosts, setWallPosts, setOpenModal },
    modalRef
) {
    const [fileError, setFileError] = useState(null);

    const goTo = useNavigate();

    function checkFileDetails(e) {
        const file = e.target.files[0];

        if (!file) {
            setFileError(null);
            return;
        }

        if (file.size > UPLOAD_SIZE_LIMIT) {
            setFileError(`File must not exceed limit of ${UPLOAD_SIZE_LIMIT_MB} MB`);
            return;
        }

        if (!ACCEPTED_FILE_TYPES.some((fileType) => file.name.endsWith(fileType))) {
            setFileError('Invalid file type');
            return;
        }

        setFileError(null);
    }

    async function changeProfilePicture(e) {
        e.preventDefault();

        const form = e.target;
        const file = form.profilePicture.files[0];

        if (fileError) {
            alert('Invalid file type/size. Please try again with a valid file.');
            return;
        } else if (!file) {
            alert('No file chosen. Please choose a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        const uploadRes = await fetchData(`/users/${user._id}/profile-picture`, 'PUT', {
            data: formData,
            hasFile: true,
        });

        if (uploadRes instanceof Error) {
            goTo('/error');
        } else if (!uploadRes.ok) {
            console.error(await uploadRes.json());
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
            <form className={galleryStyles.form} onSubmit={changeProfilePicture}>
                <label htmlFor="file">Upload new profile picture</label>
                <input
                    id="file"
                    name="profilePicture"
                    type="file"
                    aria-label="upload new profile picture"
                    accept=".jpg, .jpeg, .png, .webp"
                    onChange={checkFileDetails}
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
