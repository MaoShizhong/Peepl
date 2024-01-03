import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../../helpers/constants';
import { fetchData } from '../../../helpers/fetch';
import { toYYYYMMDD } from '../../../helpers/util';
import buttonStyles from '../../buttons/css/button.module.css';
import { Input } from '../../inputs/Input';
import { VisibilitySelect } from '../../inputs/VisibilitySelect';
import { Loading } from '../../loading/Loading';
import editStyles from '../css/edit.module.css';

export function Details({ setProfileUser }) {
    const { user, setUser } = useOutletContext();
    const [loading, setLoading] = useState(false);
    const [editError, setEditError] = useState(null);

    const changeURL = useNavigate();

    async function submitChanges(e) {
        e.preventDefault();
        setEditError(null);
        setLoading(true);

        const form = e.target;
        const formData = {};
        for (const element of Object.values(form)) {
            if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
                formData[element.name] = element.value;
            }
        }

        const editRes = await fetchData(`/users/${user._id}`, 'PUT', {
            data: formData,
            urlEncoded: true,
        });

        if (editRes instanceof Error) {
            alert(SERVER_ERROR);
        } else if (!editRes.ok) {
            const { error } = await editRes.json();
            setEditError(error);
        } else {
            const { updatedUser } = await editRes.json();
            setUser(updatedUser);
            setProfileUser({
                _id: updatedUser._id,
                handle: updatedUser.handle,
                profilePicture: updatedUser.profilePicture,
                galleryIsHidden: updatedUser.galleryIsHidden,
                name: `${updatedUser.details.firstName} ${updatedUser.details.lastName}`,
                ...(updatedUser.details.DOB.visibility !== 'hidden' && {
                    DOB: updatedUser.details.DOB.value,
                }),
                ...(updatedUser.details.city.visibility !== 'hidden' && {
                    city: updatedUser.details.city.value,
                }),
                ...(updatedUser.details.country.visibility !== 'hidden' && {
                    country: updatedUser.details.country.value,
                }),
                ...(updatedUser.details.employment.visibility !== 'hidden' && {
                    employment: updatedUser.details.employment.value,
                }),
                ...(updatedUser.details.education.visibility !== 'hidden' && {
                    education: updatedUser.details.education.value,
                }),
            });

            changeURL(`/${updatedUser.handle}`, { replace: true });
        }

        setLoading(false);
    }

    return (
        <form id="details" className={editStyles.form} onSubmit={submitChanges}>
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
            <div className={editStyles.hasVisibility}>
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
            <div className={editStyles.hasVisibility}>
                <Input
                    labelText="City"
                    name="city.value"
                    type="text"
                    aria-label="enter city"
                    defaultValue={toYYYYMMDD(user.details.city.value)}
                    isRequired={false}
                />
                <VisibilitySelect
                    name="city.visibility"
                    defaultValue={user.details.city.visibility}
                />
            </div>
            <div className={editStyles.hasVisibility}>
                <Input
                    labelText="Country"
                    name="country.value"
                    type="text"
                    aria-label="enter country"
                    defaultValue={toYYYYMMDD(user.details.country.value)}
                    isRequired={false}
                />
                <VisibilitySelect
                    name="country.visibility"
                    defaultValue={user.details.country.visibility}
                />
            </div>

            {editError && <p className={editStyles.error}>{editError}</p>}
            <button
                type="submit"
                className={`${buttonStyles.bold} ${editStyles.submit}`}
                disabled={loading}
            >
                {loading ? <Loading isInButton={true} /> : 'Submit new details'}
            </button>
        </form>
    );
}
