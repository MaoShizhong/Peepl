import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useGallery } from '../../helpers/hooks';
import buttonStyles from '../buttons/css/button.module.css';
import { Loading } from '../loading/Loading';
import { Photo } from '../photos/Photo';
import { Thumbnail } from '../photos/Thumbnail';
import { UploadPhoto } from '../photos/UploadPhoto';
import { ToggleGalleryVisiblity } from './ToggleGalleryVisiblity';
import galleryStyles from './css/gallery.module.css';

export function Gallery({ userID, setProfileUser, isHidden, isOwnProfile }) {
    const { user } = useOutletContext();
    const { gallery, setGallery, loading } = useGallery(userID, !isOwnProfile && isHidden);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [activePhoto, setActivePhoto] = useState(null);
    const [inDeleteMode, setInDeleteMode] = useState(false);

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
            <div className="sr-only" aria-live="polite">
                Now in gallery
            </div>

            {inDeleteMode && <div className={galleryStyles.deleteModeOverlay}></div>}

            <div className={galleryStyles.sectionHeading}>
                <div className={galleryStyles.left}>
                    <h2>Gallery</h2>
                    {isOwnProfile && (
                        <ToggleGalleryVisiblity
                            isGalleryHidden={isHidden}
                            setProfileUser={setProfileUser}
                        />
                    )}
                </div>
                {isOwnProfile && (
                    <div className={galleryStyles.buttons}>
                        <button
                            onClick={() => setInDeleteMode(!inDeleteMode)}
                            className={buttonStyles.subtle}
                            aria-label={inDeleteMode ? 'exit delete mode' : 'enter delete mode'}
                        >
                            {inDeleteMode ? 'Cancel' : 'Delete mode'}
                        </button>
                        {!inDeleteMode && (
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className={buttonStyles.bold}
                                aria-label="upload photo to gallery"
                            >
                                Upload
                            </button>
                        )}
                    </div>
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
                <p className={galleryStyles.empty}>
                    This user has chosen to make their gallery visible only to their friends.
                </p>
            ) : !gallery.length ? (
                <p className={galleryStyles.empty}>No photos in gallery.</p>
            ) : (
                <div className={galleryStyles.gallery}>
                    {gallery.map((photo) => (
                        <Thumbnail
                            key={photo._id}
                            photo={photo}
                            setActivePhoto={setActivePhoto}
                            setIsPhotoModalOpen={setIsPhotoModalOpen}
                            setGallery={setGallery}
                            inDeleteMode={inDeleteMode}
                        />
                    ))}
                </div>
            )}

            {isPhotoModalOpen && (
                <Photo
                    photo={activePhoto}
                    photoURL={activePhoto.url}
                    setOpenPhotoModal={setIsPhotoModalOpen}
                    setGallery={setGallery}
                    isOwnProfile={userID === user._id}
                    ref={photoRef}
                />
            )}
        </section>
    );
}
