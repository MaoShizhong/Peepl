import { forwardRef } from 'react';

export const EditDetails = forwardRef(function EditDetails({ user, setOpenEditModal }, modalRef) {
    return (
        <dialog onClose={() => setOpenEditModal(null)} ref={modalRef} aria-modal>
            EditDetails
        </dialog>
    );
});
