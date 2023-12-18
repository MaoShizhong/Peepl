import { forwardRef } from 'react';
import { closeOnClickOutside } from '../../helpers/util';
import galleryStyles from './css/gallery.module.css';

export const Photo = forwardRef(function Photo(
    { photo, photoURL, setOpenPhotoModal, isOwnProfile },
    modalRef
) {
    console.log(photo)
    return (
        <dialog
            className={galleryStyles.modal}
            onClose={() => setOpenPhotoModal(false)}
            onClick={(e) => closeOnClickOutside(e, modalRef)}
            ref={modalRef}
            aria-modal
        >
            <img
                src={photoURL}
                alt="gallery photo"
                height={photo.height}
                width={photo.width}
                className={galleryStyles.photo}
            />
        </dialog>
    );
});
