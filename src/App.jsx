import { Outlet } from 'react-router';
import { Header } from './components/Header';
import { Loading } from './components/loading/Loading';
import { Login } from './components/login/Login';
import { useAutoLogin } from './helpers/hooks';

export default function App() {
    const { user, setUser, initialising } = useAutoLogin();

    return (
        <>
            {initialising ? (
                <Loading text='Initialising' />
            ) : user ? (
                <>
                    <Header />
                    <Outlet context={{ user, setUser }} />
                </>
            ) : (
                <Login setUser={setUser} />
            )}
        </>
    );
}
