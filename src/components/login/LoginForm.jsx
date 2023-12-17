import buttonStyles from '../buttons/css/button.module.css';
import loginStyles from './css/login.module.css';

export function LoginForm({ hasError, setIsForgotModalShowing }) {
    return (
        <>
            <div className="sr-only" aria-live="polite">
                Login screen
            </div>

            <input
                name="email"
                type="email"
                placeholder="Email"
                aria-label="enter email"
                autoComplete="email"
                required
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                aria-label="enter password"
                required
            />

            {hasError && <p className={loginStyles.error}>Incorrect email or password</p>}

            <button className={buttonStyles.bold}>Login</button>

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

            <button
                type="button"
                className={loginStyles.forgot}
                onClick={() => setIsForgotModalShowing(true)}
            >
                Forgot password?
            </button>
        </>
    );
}
