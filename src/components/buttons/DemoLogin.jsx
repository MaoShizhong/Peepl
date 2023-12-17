import { Loading } from '../loading/Loading';
import buttonStyles from './css/button.module.css';

export function DemoLogin({ demoAccountNumber, submitForm, loading }) {
    return (
        <button
            type="button"
            onClick={(e) => submitForm(e, demoAccountNumber)}
            className={buttonStyles.bold}
            aria-label={`Login with demo account ${demoAccountNumber}`}
        >
            {loading ? <Loading isInButton={true} /> : `Demo account ${demoAccountNumber}`}
        </button>
    );
}
