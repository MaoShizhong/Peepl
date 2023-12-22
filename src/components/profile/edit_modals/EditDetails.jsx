import { forwardRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { closeOnClickOutside, toYYYYMMDD } from '../../../helpers/util';
import buttonStyles from '../../buttons/css/button.module.css';
import { Input } from '../../inputs/Input';
import { VisibilitySelect } from '../../inputs/VisibilitySelect';
import { Loading } from '../../loading/Loading';
import errorStyles from '../../login/css/login.module.css';
import modalStyles from '../css/edit.module.css';

export const EditDetails = forwardRef(function EditDetails({ setOpenEditModal }, modalRef) {
    const { user, setUser } = useOutletContext();
    const [loading, setLoading] = useState(false);
    const [editError, setEditError] = useState(null);

    async function submitChanges(e) {
        e.preventDefault();
        console.log(user);
    }

    return (
        <dialog
            className={modalStyles.modal}
            onClose={() => setOpenEditModal(null)}
            onClick={(e) => closeOnClickOutside(e, modalRef)}
            ref={modalRef}
            aria-modal
        >
            <form className={modalStyles.form} onSubmit={submitChanges}>
                <Input
                    name="handle"
                    type="text"
                    labelText="Handle"
                    ariaLabel="handle"
                    autoComplete="off"
                    defaultValue={user.handle}
                    isRequired={true}
                />

                <Input
                    labelText="First name"
                    name="firstName"
                    type="text"
                    aria-label="enter first name"
                    autoComplete="off"
                    defaultValue={user.details.firstName}
                    isRequired={true}
                />

                <Input
                    labelText="Family name"
                    name="lastName"
                    type="text"
                    aria-label="enter family name/surname"
                    autoComplete="off"
                    defaultValue={user.details.lastName}
                    isRequired={true}
                />

                <div className={modalStyles.hasVisibility}>
                    <Input
                        labelText="Date of birth"
                        name="DOB.value"
                        type="date"
                        aria-label="enter date of birth"
                        defaultValue={toYYYYMMDD(user.details.DOB.value)}
                        isRequired={true}
                    />
                    <VisibilitySelect
                        name="DOB.visibility"
                        defaultValue={user.details.DOB.visibility}
                    />
                </div>

                <div className={modalStyles.hasVisibility}>
                    <Input
                        labelText="City"
                        name="city.value"
                        type="text"
                        aria-label="enter city"
                        defaultValue={toYYYYMMDD(user.details.city.value)}
                        isRequired={true}
                    />
                    <VisibilitySelect
                        name="city.visibility"
                        defaultValue={user.details.city.visibility}
                    />
                </div>

                <div className={modalStyles.hasVisibility}>
                    <Input
                        labelText="Country"
                        name="country.value"
                        type="text"
                        aria-label="enter country"
                        defaultValue={toYYYYMMDD(user.details.country.value)}
                        isRequired={true}
                    />
                    <VisibilitySelect
                        name="country.visibility"
                        defaultValue={user.details.country.visibility}
                    />
                </div>

                {editError && <p className={errorStyles.error}>{editError}</p>}

                <div className={modalStyles.buttons}>
                    {!loading && (
                        <button
                            type="button"
                            className={buttonStyles.subtle}
                            onClick={() => setOpenEditModal(null)}
                        >
                            Cancel
                        </button>
                    )}
                    <button type="submit" className={buttonStyles.bold} disabled={loading}>
                        {loading ? <Loading isInButton={true} /> : 'Submit'}
                    </button>
                </div>
            </form>
        </dialog>
    );
});
