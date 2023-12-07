import buttonStyles from './css/button.module.css';

export function EditButton({ infoSection, setOpenEditModal }) {
    return (
        <button className={buttonStyles.subtle} onClick={() => setOpenEditModal(infoSection)}>
            Edit {infoSection}
        </button>
    );
}
