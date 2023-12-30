import { useOutletContext } from 'react-router-dom';
import buttonStyles from '../buttons/css/button.module.css';
import { ChangeEmail } from './ChangeEmail';
import settingsStyles from './css/settings.module.css';

export function Settings() {
    const { user } = useOutletContext();

    async function confirmSendAccountDeletionEmail() {}

    return (
        <main className={settingsStyles.main}>
            <div className="sr-only" aria-live="polite">
                Settings
            </div>

            {!user.isGithub && <ChangeEmail />}

            <button className={buttonStyles.subtle} onClick={confirmSendAccountDeletionEmail}>
                Request account deletion
            </button>
        </main>
    );
}
