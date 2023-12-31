import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import { useTokenValidation } from '../../helpers/hooks';
import buttonStyles from '../buttons/css/button.module.css';
import { Loading } from '../loading/Loading';
import authStyles from './css/auth.module.css';

export function AccountDeletion() {
    const { token } = useParams();
    const { isValidToken, validating } = useTokenValidation('deletion', token);

    const goTo = useNavigate();

    async function confirmAccountDeletion() {
        const deleteRes = await fetchData(`/auth/deletion-tokens/${token}`, 'DELETE');

        if (deleteRes instanceof Error || !deleteRes.ok) {
            alert(SERVER_ERROR);
        } else {
            alert('Account successfully deleted.');
            goTo('/');
        }
    }

    return (
        <main className={authStyles.main}>
            {validating ? (
                <Loading text="Validating link" />
            ) : !isValidToken ? (
                <section className={authStyles.content}>
                    <h1>Link expired or not valid</h1>

                    <a className={buttonStyles.bold} href="/">
                        Click here to go back
                    </a>
                </section>
            ) : (
                <section className={authStyles.content}>
                    <h1>Delete account?</h1>

                    <button onClick={confirmAccountDeletion} className={buttonStyles.bold}>
                        Yes, delete my account
                    </button>

                    <a className={`${buttonStyles.subtle} ${authStyles.darkText}`} href="/">
                        No, I do not want to delete my account
                    </a>
                </section>
            )}
        </main>
    );
}
