import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { useTokenValidation } from '../../helpers/hooks';
import buttonStyles from '../buttons/css/button.module.css';
import { Input } from '../inputs/Input';
import { Loading } from '../loading/Loading';
import authStyles from './css/auth.module.css';

export function PasswordReset() {
    const { token } = useParams();
    const { isValidToken, validating } = useTokenValidation('password', token);
    const [passwordError, setPasswordError] = useState(null);

    const goTo = useNavigate();

    async function submitNewPassword(e) {
        e.preventDefault();
        setPasswordError(null);

        const form = e.target;

        const passwordRes = await fetchData(`/auth/password-tokens/${token}`, 'DELETE', {
            data: { password: form.password.value, confirm: form.confirm.value },
            urlEncoded: true,
        });

        if (passwordRes instanceof Error) {
            alert(SERVER_ERROR);
        } else if (!passwordRes.ok) {
            const { error } = await passwordRes.json();
            setPasswordError(error);
        } else {
            alert('Password successfully changed. Please log back in.');
            goTo('/');
        }
    }

    return (
        <main className={authStyles.main}>
            {validating ? (
                <Loading text="Validating link" />
            ) : !isValidToken ? (
                <section className={authStyles.content}>
                    <h1>Link expired or not valid</h1>

                    <a className={buttonStyles.bold} href="/">
                        Click here to go back
                    </a>
                </section>
            ) : (
                <form className={authStyles.form} onSubmit={submitNewPassword}>
                    <h1 className={authStyles.logo}>Peepl</h1>

                    <h2>Password Reset</h2>

                    <div className={authStyles.reqs}>
                        <p tabIndex={0}>New password must contain:</p>
                        <ul>
                            <li>Minimum 8 characters</li>
                            <li>At least 1 uppercase</li>
                            <li>At least 1 lowercase</li>
                            <li>At least 1 number</li>
                        </ul>
                    </div>

                    <Input
                        labelText="New password"
                        name="password"
                        type="password"
                        aria-label="enter new password"
                        autoComplete="new-password"
                        onInput={() => setPasswordError(null)}
                        isRequired={true}
                    />
                    <Input
                        labelText="Confirm new password"
                        name="confirm"
                        type="password"
                        aria-label="confirm new password"
                        autoComplete="off"
                        onInput={() => setPasswordError(null)}
                        isRequired={true}
                    />

                    {passwordError && <p className={authStyles.error}>{passwordError}</p>}

                    <button onClick={submitNewPassword} className={buttonStyles.bold}>
                        Set new password
                    </button>
                </form>
            )}
        </main>
    );
}
