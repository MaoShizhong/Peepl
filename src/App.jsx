import { Outlet } from 'react-router';
import { Header } from './components/header/Header';
import { Loading } from './components/loading/Loading';
import { Login } from './components/login/Login';
import { useAutoLogin, useIncomingFriendRequests } from './helpers/hooks';

export default function App() {
    const { user, setUser, initialising } = useAutoLogin();
    const { incomingFriendRequests, setIncomingFriendRequests } = useIncomingFriendRequests(user);

    return (
        <>
            {initialising ? (
                <Loading isSplash={true} />
            ) : window.location.pathname.includes('login') ? (
                // handles redirect login from github
                <Outlet context={{ setUser }} />
            ) : user ? (
                <>
                    <Header
                        setUser={setUser}
                        userHandle={user.handle}
                        userID={user._id}
                        incomingFriendRequests={incomingFriendRequests}
                        setIncomingFriendRequests={setIncomingFriendRequests}
                    />
                    <Outlet context={{ user, setUser, setIncomingFriendRequests }} />
                </>
            ) : (
                <Login setUser={setUser} />
            )}
        </>
    );
}
