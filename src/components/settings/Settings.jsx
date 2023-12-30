import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import buttonStyles from '../buttons/css/button.module.css';
import { ChangeEmail } from './ChangeEmail';
import settingsStyles from './css/settings.module.css';

export function Settings() {
    const { user } = useOutletContext();

    async function confirmSendEmailWithLink(type) {
        if (user.isDemo) {
            alert(
                type === 'password'
                    ? 'Cannot change demo account password.'
                    : 'Cannot delete demo account.'
            );
            return;
        }

        let confirmationMessage = `${user.email}\nA one-time-use link to ${
            type === 'password' ? 'reset your password' : 'confirm account deletion'
        } will be sent to the above email associated with your account.`;
        if (user.isGithub) {
            confirmationMessage +=
                '\nIf this is not the same email registered to your Github account, please log out then log back in and try again.';
        }

        const confirmation = confirm(confirmationMessage);
        if (!confirmation) return;

        const endpoint = type === 'password' ? `/users/${user._id}/password` : `/users/${user._id}`;
        const method = type === 'password' ? 'PATCH' : 'DELETE';
        const emailRes = await fetchData(endpoint, method);

        if (emailRes instanceof Error || !emailRes.ok) {
            alert(SERVER_ERROR);
        } else {
            alert('An email containing a one-time use link has sent to the email associated with this account.');
        }
    }

    return (
        <main className={settingsStyles.main}>
            <div className="sr-only" aria-live="polite">
                Settings
            </div>

            {!user.isGithub && (
                <>
                    <ChangeEmail />

                    <button
                        className={buttonStyles.subtle}
                        onClick={() => confirmSendEmailWithLink('password')}
                    >
                        Request password reset
                    </button>
                </>
            )}

            <button
                className={buttonStyles.subtle}
                onClick={() => confirmSendEmailWithLink('deletion')}
            >
                Request account deletion
            </button>
        </main>
    );
}
