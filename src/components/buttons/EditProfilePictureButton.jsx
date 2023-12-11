import buttonStyles from './css/button.module.css';

export function EditProfilePictureButton({ setOpenModal }) {
    return (
        <button
            className={`${buttonStyles.subtle} ${buttonStyles.svg}`}
            onClick={() => setOpenModal(true)}
        >
            <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none">
                <g>
                    <path
                        d="M14 6L8 12V16H12L18 10M14 6L17 3L21 7L18 10M14 6L18 10M10 4L4 4L4 20L20 20V14"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    ></path>
                </g>
            </svg>
        </button>
    );
}
