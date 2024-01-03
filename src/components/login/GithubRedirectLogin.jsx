import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { fetchData } from '../../helpers/fetch';
import { Loading } from '../loading/Loading';

export function GithubRedirectLogin() {
    const { token } = useParams();
    const { setUser } = useOutletContext();

    const goTo = useNavigate();

    useEffect(() => {
        async function autoLogin() {
            const res = await fetchData(`/auth/sessions/github/${token}`, 'POST');

            if (res.ok) {
                const user = await res.json();
                setUser(user);
            } else {
                setUser(null);
            }

            goTo('/');
        }

        autoLogin();
    }, [token, goTo, setUser]);

    return <Loading text="Logging in" />;
}
