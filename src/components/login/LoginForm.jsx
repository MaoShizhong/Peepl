import buttonStyles from '../buttons/css/button.module.css';
import { Input } from '../inputs/Input';
import { Loading } from '../loading/Loading';
import loginStyles from './css/login.module.css';

export function LoginForm({ hasError, setIsForgotModalShowing, loading }) {
    return (
        <>
            <div className="sr-only" aria-live="polite">
                Login screen
            </div>

            <Input
                labelText="Email"
                name="email"
                type="email"
                aria-label="enter email"
                autoComplete="email"
                isRequired={true}
            />

            <Input
                labelText="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-label="enter password"
                isRequired={true}
            />

            {hasError && <p className={loginStyles.error}>Incorrect email or password</p>}

            <button
                type="button"
                className={loginStyles.forgot}
                onClick={() => setIsForgotModalShowing(true)}
            >
                Forgot password?
            </button>

            <button className={buttonStyles.bold}>
                {loading ? <Loading isInButton={true} /> : 'Login'}
            </button>

            <p className={loginStyles.or}>or</p>

            <a
                href={`${
                    import.meta.env.VITE_MODE === 'prod'
                        ? import.meta.env.VITE_PROD_API
                        : import.meta.env.VITE_DEV_API
                }/auth/users/github`}
                className={`${buttonStyles.subtle} ${loginStyles.githubLogin}`}
            >
                <img src="/github.png" alt="github login logo" />
                Login with Github
            </a>
        </>
    );
}
