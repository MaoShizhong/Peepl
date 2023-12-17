import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../helpers/fetch';
import { DemoLogin } from '../buttons/DemoLogin';
import { LoginForm } from './LoginForm';
import { LoginFormSwitch } from './LoginFormSwitch';
import { SignupForm } from './SignupForm';
import loginStyles from './css/login.module.css';

export function Login({ setUser }) {
    const [activeForm, setActiveForm] = useState('Login');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const goTo = useNavigate();

    async function submitForm(e, demoAccount) {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();

        // handle demo account button
        if (demoAccount) {
            form.append('email', `demo${demoAccount}@demo.com`);
            form.append('password', `${import.meta.env.VITE_DEMO_PW}${demoAccount}`);
        } else {
            for (const element of Object.values(e.target)) {
                if (element instanceof HTMLInputElement && !element.files) {
                    form.append(element.name, element.value);
                } else if (element.files && element.files.length) {
                    form.append(element.name, element.files[0]);
                }
            }
        }

        const endpoint = activeForm === 'Login' ? '/auth/sessions/local' : '/auth/users';

        const res = await fetchData(endpoint, 'POST', {
            data: form,
            urlEncoded: activeForm === 'Login',
        });

        if (res instanceof Error) {
            goTo('/error');
        } else if (res.ok) {
            const user = await res.json();
            setUser(user);
            goTo('/');
        } else if (res.status === 401) {
            setError(true);
        } else {
            const { error: fetchError } = await res.json();
            setError(fetchError);
        }

        setLoading(false);
    }

    // Reset errors when changing form
    function changeForm(type) {
        setError(null);
        setActiveForm(type);
    }

    return (
        <main className={loginStyles.noUser}>
            <div className={loginStyles.container}>
                <h1 className={loginStyles.logo}>Peepl</h1>

                <nav className={loginStyles.formSelect}>
                    <LoginFormSwitch
                        targetForm="Login"
                        activeForm={activeForm}
                        changeForm={changeForm}
                    />
                    <LoginFormSwitch
                        targetForm="Sign up"
                        activeForm={activeForm}
                        changeForm={changeForm}
                    />
                </nav>

                <form className={loginStyles.loginSignup} onSubmit={submitForm}>
                    {activeForm === 'Login' ? (
                        <>
                            <LoginForm hasError={Boolean(error)} loading={loading} />

                            <div className={loginStyles.demo}>
                                <DemoLogin
                                    demoAccountNumber={1}
                                    submitForm={submitForm}
                                    loading={loading}
                                />
                                <DemoLogin
                                    demoAccountNumber={2}
                                    submitForm={submitForm}
                                    loading={loading}
                                />
                            </div>
                        </>
                    ) : (
                        <SignupForm error={error} loading={loading} />
                    )}
                </form>
            </div>
        </main>
    );
}
