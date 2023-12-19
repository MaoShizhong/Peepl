import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { extractPhotoID } from '../../helpers/util';
import { Loading } from '../loading/Loading';
import { Bin } from './Bin';
import galleryStyles from './css/gallery.module.css';

export function Thumbnail({
    photo,
    setActivePhoto,
    setIsPhotoModalOpen,
    setGallery,
    inDeleteMode,
}) {
    const { user } = useOutletContext();
    const [deleting, setDeleting] = useState(false);

    async function handleClick() {
        if (deleting) return;

        if (inDeleteMode) {
            setDeleting(true);

            const deleteRes = await fetchData(
                `/users/${user._id}/gallery/${extractPhotoID(photo.url)}`,
                'DELETE'
            );

            if (deleteRes instanceof Error || !deleteRes.ok) {
                alert(SERVER_ERROR);
            } else {
                setGallery((prev) => prev.filter((galleryPhoto) => galleryPhoto._id !== photo._id));
            }

            setDeleting(false);
        } else {
            setActivePhoto(photo);
            setIsPhotoModalOpen(true);
        }
    }

    return (
        <div className={galleryStyles.thumbnail} onClick={handleClick}>
            <img src={photo.url} alt="gallery photo" height="180" width="180" />
            {deleting ? (
                <div className={galleryStyles.deleteThumbnailOverlay}>
                    <Loading isInButton={true} />
                </div>
            ) : inDeleteMode ? (
                <Bin />
            ) : null}
        </div>
    );
}
