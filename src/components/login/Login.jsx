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
    const [errors, setErrors] = useState(null);

    const goTo = useNavigate();

    async function submitForm(e, demoAccount) {
        e.preventDefault();

        const form = {};

        // handle demo account button
        if (demoAccount) {
            form.email = `demo${demoAccount}@demo.com`;
            form.password = `${import.meta.env.VITE_DEMO_PW}${demoAccount}`;
        } else {
            for (const element of Object.values(e.target)) {
                if (element instanceof HTMLInputElement) {
                    form[element.name] = element.value;
                }
            }
        }

        const endpoint = activeForm === 'Login' ? '/auth/sessions/local' : '/auth/users';

        const res = await fetchData(endpoint, 'POST', { data: form, hasFile: false });

        if (res instanceof Error) {
            goTo('/error');
        } else if (res.ok) {
            const user = await res.json();
            setUser(user);
            goTo('/');
        } else if (res.status === 401) {
            setErrors(true);
        } else {
            const { error } = await res.json();
            setErrors(error);
        }
    }

    // Reset errors when changing form
    function changeForm(type) {
        setErrors(null);
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
                            <LoginForm hasError={errors} />

                            <div className={loginStyles.demo}>
                                <DemoLogin demoAccountNumber={1} submitForm={submitForm} />
                                <DemoLogin demoAccountNumber={2} submitForm={submitForm} />
                            </div>
                        </>
                    ) : (
                        <SignupForm errors={errors} />
                    )}
                </form>
            </div>
        </main>
    );
}
