import { forwardRef } from 'react';
import { closeOnClickOutside } from '../../helpers/util';
import galleryStyles from './css/gallery.module.css';

export const Photo = forwardRef(function Photo({ photo, setOpenPhotoModal }, modalRef) {
    return (
        <dialog
            className={galleryStyles.modal}
            onClose={() => setOpenPhotoModal(false)}
            onClick={(e) => closeOnClickOutside(e, modalRef)}
            ref={modalRef}
            aria-modal
        >
            <img src={photo} alt="gallery photo" className={galleryStyles.photo} />
        </dialog>
    );
});
