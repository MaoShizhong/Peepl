import loginStyles from './css/login.module.css';

export function LoginFormSwitch({ targetForm, activeForm, changeForm }) {
    return (
        <button
            className={activeForm === targetForm ? loginStyles.active : ''}
            onClick={() => changeForm(targetForm)}
            aria-label={`Switch to ${targetForm.toLowerCase()} screen`}
        >
            {targetForm}
        </button>
    );
}
