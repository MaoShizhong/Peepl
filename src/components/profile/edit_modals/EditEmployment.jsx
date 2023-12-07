import { forwardRef } from 'react';

export const EditEmployment = forwardRef(function EditEmployment({ user }, modalRef) {
    return (
        <dialog ref={modalRef} aria-modal>
            EditEmployment
        </dialog>
    );
});
