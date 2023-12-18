import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useGallery } from '../../helpers/hooks';
import { ToggleGalleryVisiblity } from '../buttons/ToggleGalleryVisiblity';
import buttonStyles from '../buttons/css/button.module.css';
import { Loading } from '../loading/Loading';
import { Photo } from '../photos/Photo';
import { Thumbnail } from '../photos/Thumbnail';
import { UploadPhoto } from '../photos/UploadPhoto';
import galleryStyles from './css/gallery.module.css';

export function Gallery({ userID, setProfileUser, isHidden, isOwnProfile }) {
    const { user } = useOutletContext();
    const { gallery, setGallery, loading } = useGallery(userID, !isOwnProfile && isHidden);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [activePhoto, setActivePhoto] = useState(null);

    const uploadRef = useRef(null);
    const photoRef = useRef(null);

    useEffect(() => {
        if (uploadRef.current) uploadRef.current.showModal();
    }, [isUploadModalOpen]);

    useEffect(() => {
        if (!isPhotoModalOpen) {
            setActivePhoto(null);
        } else if (photoRef.current) {
            photoRef.current.showModal();
        }
    }, [isPhotoModalOpen]);

    return (
        <section>
            <div className={galleryStyles.sectionHeading}>
                <h2>Gallery</h2>
                {isOwnProfile && (
                    <ToggleGalleryVisiblity
                        isGalleryHidden={isHidden}
                        setProfileUser={setProfileUser}
                    />
                )}
                {isOwnProfile && (
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className={buttonStyles.bold}
                    >
                        Upload
                    </button>
                )}
            </div>

            {isUploadModalOpen && (
                <UploadPhoto
                    user={user}
                    setGallery={setGallery}
                    setOpenModal={setIsUploadModalOpen}
                    uploadTarget="gallery"
                    ref={uploadRef}
                />
            )}

            {loading ? (
                <Loading text="Fetching gallery" />
            ) : !isOwnProfile && isHidden ? (
                'This user has chosen to make their gallery visible only to their friends.'
            ) : !gallery.length ? (
                'No photos in gallery.'
            ) : (
                <div className={galleryStyles.gallery}>
                    {gallery.map((photo) => (
                        <Thumbnail
                            key={photo._id}
                            photo={photo}
                            setActivePhoto={setActivePhoto}
                            setIsPhotoModalOpen={setIsPhotoModalOpen}
                        />
                    ))}
                </div>
            )}

            {isPhotoModalOpen && (
                <Photo
                    photo={activePhoto}
                    photoURL={activePhoto.url}
                    setOpenPhotoModal={setIsPhotoModalOpen}
                    ref={photoRef}
                />
            )}
        </section>
    );
}
