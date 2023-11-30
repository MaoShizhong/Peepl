import { useEffect, useState } from 'react';
import { fetchData } from './fetch';

export const useAutoLogin = () => {
    const [user, setUser] = useState(null);
    const [initialising, setInitialising] = useState(true);

    useEffect(() => {
        async function autoLogin() {
            if (window.location.pathname.includes('login')) {
                setInitialising(false);
                return;
            }

            const res = await fetchData('/auth/sessions/all', 'GET');

            if (res instanceof Error) {
                alert('Something went wrong with the server, please try again later!');
            } else if (res.ok) {
                setUser(await res.json());
            }

            setInitialising(false);
        }

        autoLogin();
    }, []);

    return { user, setUser, initialising };
};
