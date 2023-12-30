import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import buttonStyles from '../buttons/css/button.module.css';
import { Input } from '../inputs/Input';
import settingsStyles from './css/settings.module.css';

export function ChangeEmail() {
    const { user, setUser } = useOutletContext();
    const [error, setError] = useState(null);

    async function changeEmail(e) {
        e.preventDefault();
        setError(null);

        if (user.isDemo) {
            setError('Details cannot be changed on a demo account.');
            return;
        }

        const form = e.target;
        const changeRes = await fetchData(`/users/${user._id}/email`, 'PATCH', {
            data: { email: form.email.value, password: form.password.value },
            urlEncoded: true,
        });

        if (changeRes instanceof Error) {
            alert(SERVER_ERROR);
        } else if (!changeRes.ok) {
            const { error: errorMessage } = await changeRes.json();
            setError(errorMessage);
        } else {
            const { newEmail } = await changeRes.json();
            setUser({ ...user, email: newEmail });
            alert('Email successfully changed.');
            form.reset();
        }
    }

    return (
        <form onSubmit={changeEmail} className={settingsStyles.changeEmail}>
            <Input
                labelText="Email"
                name="email"
                type="email"
                autoComplete="off"
                ariaLabel="enter new email"
                defaultValue={user.email}
                onInput={() => setError(null)}
                isRequired={true}
            />

            <Input
                labelText="Confirm password"
                name="password"
                type="password"
                autoComplete="current-password"
                ariaLabel="confirm password"
                onInput={() => setError(null)}
                isRequired={true}
            />

            {error && <p className={settingsStyles.error}>{error}</p>}

            <button className={buttonStyles.bold} disabled={user.isDemo}>
                {user.isDemo ? 'Disabled on demo account' : 'Submit new email'}
            </button>
        </form>
    );
}
