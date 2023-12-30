import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import buttonStyles from '../buttons/css/button.module.css';
import { ChangeEmail } from './ChangeEmail';
import settingsStyles from './css/settings.module.css';

export function Settings() {
    const { user } = useOutletContext();

    async function confirmSendAccountDeletionEmail() {
        if (user.isDemo) {
            alert('Cannot delete demo account.');
            return;
        }

        let confirmationMessage = `${user.email}\nA one-time-use link to confirm account deletion will be sent to the above email.`;
        if (user.isGithub) {
            confirmationMessage +=
                '\nIf this is not the same email registered to your Github account, please log out then log back in and try again.';
        }

        const confirmation = confirm(confirmationMessage);
        if (!confirmation) return;

        const deleteRes = await fetchData(`/users/${user._id}`, 'DELETE');

        if (deleteRes instanceof Error || !deleteRes.ok) {
            alert(SERVER_ERROR);
        } else {
            alert('Delete link sent to the email associated with this account.');
        }
    }

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
