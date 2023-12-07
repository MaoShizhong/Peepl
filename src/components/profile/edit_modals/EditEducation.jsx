import { forwardRef } from 'react';

export const EditEducation = forwardRef(function EditEducation({ user }, modalRef) {
    return (
        <dialog ref={modalRef} aria-modal>
            EditEducation
        </dialog>
    );
});
