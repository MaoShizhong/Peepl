import { useEffect, useLayoutEffect, useState } from 'react';
import { MOBILE_BREAKPOINT_PX, SERVER_ERROR } from './constants';
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

            const res = await fetchData('/auth/sessions', 'GET');

            if (res instanceof Error) {
                alert(SERVER_ERROR);
            } else if (res.ok) {
                setUser(await res.json());
            }

            setInitialising(false);
        }

        autoLogin();
    }, []);

    return { user, setUser, initialising };
};

export const useCloseDropdown = (dropdown, headerButton, setIsDropdownOpen) => {
    useEffect(() => {
        function closeDropdown(e) {
            if (dropdown.current.contains(e.target) || headerButton.current.contains(e.target)) {
                return;
            }

            setIsDropdownOpen(false);
        }

        window.addEventListener('pointerup', closeDropdown);

        return () => window.removeEventListener('pointerup', closeDropdown);
    }, [dropdown, headerButton, setIsDropdownOpen]);
};

export const useProfile = (handle) => {
    const [profileUser, setProfileUser] = useState(null);
    const [friendsList, setFriendsList] = useState([]);
    const [wallPosts, setWallPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error404, setError404] = useState(false);

    useEffect(() => {
        async function getProfile() {
            const profileRes = await fetchData(`/users/${handle}`, 'GET');

            if (profileRes instanceof Error) {
                alert(SERVER_ERROR);
            } else if (!profileRes.ok) {
                setError404(true);
            } else {
                const profileData = await profileRes.json();

                setProfileUser(profileData.user);
                setFriendsList(profileData.friends);
                setWallPosts(profileData.wall);
            }

            setLoading(false);
        }

        getProfile();
    }, [handle]);

    return { profileUser, setProfileUser, friendsList, wallPosts, setWallPosts, loading, error404 };
};

export const useFeed = (userID) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getFeed() {
            const feedRes = await fetchData(`/users/${userID}/feed`, 'GET');

            if (feedRes instanceof Error || !feedRes.ok) {
                alert(SERVER_ERROR);
            } else {
                const { feed } = await feedRes.json();
                setPosts(feed);
            }

            setLoading(false);
        }

        getFeed();
    }, [userID]);

    return { posts, setPosts, loading };
};

export const useMobileLayout = () => {
    const [isSmallWidth, setIsSmallWidth] = useState(false);

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsSmallWidth(window.innerWidth <= MOBILE_BREAKPOINT_PX);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isSmallWidth;
};
