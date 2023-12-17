import { getLocaleDateFormat } from '../../helpers/util';
import buttonStyles from '../buttons/css/button.module.css';
import { Input } from './Input';
import loginStyles from './css/login.module.css';

export function SignupForm({ errors }) {
    return (
        <>
            <div className="sr-only" aria-live="polite">
                Account creation screen
            </div>

            {errors && (
                <ul>
                    {errors.map((error, i) => (
                        <li key={i} className={loginStyles.error}>
                            {error.msg}
                        </li>
                    ))}
                </ul>
            )}
            <p className={loginStyles.reqs}>Required fields are marked with (required)</p>

            <fieldset className={loginStyles.credentials}>
                <legend>Credentials</legend>

                <Input
                    labelText="Email"
                    name="email"
                    type="email"
                    aria-label="enter email"
                    autoComplete="off"
                    isRequired={true}
                />
                <Input
                    labelText="Password"
                    name="password"
                    type="password"
                    aria-label="enter password"
                    autoComplete="new-password"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                    isRequired={true}
                />
                <Input
                    labelText="Confirm password"
                    name="confirm"
                    type="password"
                    aria-label="confirm password"
                    autoComplete="off"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                    isRequired={true}
                />
            </fieldset>

            <p className={loginStyles.reqs} tabIndex={0}>
                Password must be at least 8 characters and include at least 1 uppercase, 1
                lowercase, and 1 number
            </p>

            <fieldset className={loginStyles.personalDetails}>
                <legend>Personal details</legend>
                <div>
                    <Input
                        labelText="First name"
                        name="firstName"
                        type="text"
                        aria-label="enter first name"
                        autoComplete="off"
                        isRequired={true}
                    />
                    <Input
                        labelText="Family name"
                        name="lastName"
                        type="text"
                        aria-label="enter family name/surname"
                        autoComplete="off"
                        isRequired={true}
                    />
                </div>

                <Input
                    labelText={`Date of birth - ${getLocaleDateFormat()}`}
                    name="DOB"
                    type="date"
                    aria-label="enter date of birth"
                    isRequired={true}
                />

                <div>
                    <Input
                        labelText="City"
                        name="city"
                        type="text"
                        aria-label="(optional) enter city"
                    />
                    <Input
                        labelText="Country"
                        name="country"
                        type="text"
                        aria-label="(optional) enter country"
                    />
                </div>
            </fieldset>

            <button className={buttonStyles.bold}>Create account</button>

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
                Create account using Github
            </a>
        </>
    );
}
