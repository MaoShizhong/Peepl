import buttonStyles from './css/button.module.css';

export function DemoLogin({ demoAccountNumber, submitForm }) {
    return (
        <button
            type="button"
            onClick={(e) => submitForm(e, demoAccountNumber)}
            className={buttonStyles.bold}
            aria-label={`Login with demo account ${demoAccountNumber}`}
        >
            Demo account {demoAccountNumber}
        </button>
    );
}
