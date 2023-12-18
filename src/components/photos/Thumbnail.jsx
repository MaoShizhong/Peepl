import galleryStyles from './css/gallery.module.css';

export function Thumbnail({ photo, setActivePhoto, setIsPhotoModalOpen }) {
    return (
        <div
            className={galleryStyles.thumbnail}
            onClick={() => {
                setActivePhoto(photo);
                setIsPhotoModalOpen(true);
            }}
        >
            <img src={photo.url} alt="gallery photo" height="180" width="180" />
        </div>
    );
}
