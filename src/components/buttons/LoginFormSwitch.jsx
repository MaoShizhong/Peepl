import buttonStyles from './css/button.module.css';

export function LoginFormSwitch({ targetForm, activeForm, changeForm }) {
    let styleClasses = `${buttonStyles.subtle}`;
    if (activeForm === targetForm) styleClasses += ` ${buttonStyles.active}`;

    return (
        <button
            className={styleClasses}
            onClick={() => changeForm(targetForm)}
            aria-label={`Switch to ${targetForm.toLowerCase()} screen`}
        >
            {targetForm}
        </button>
    );
}
