import { useEffect, useLayoutEffect, useState } from 'react';
import { MOBILE_BREAKPOINT_PX, SERVER_ERROR } from './constants';
import { DOMAIN, fetchData } from './fetch';

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
            if (
                !dropdown.current ||
                dropdown.current.contains(e.target) ||
                headerButton.current.contains(e.target)
            ) {
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
            setLoading(true);

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

    return {
        profileUser,
        setProfileUser,
        friendsList,
        setFriendsList,
        wallPosts,
        setWallPosts,
        loading,
        error404,
    };
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

export const useGallery = (userID, shouldFetchGallery) => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getGallery() {
            const galleryRes = await fetchData(`/users/${userID}/gallery`, 'GET');

            if (galleryRes instanceof Error || !galleryRes.ok) {
                alert(SERVER_ERROR);
            } else {
                const data = await galleryRes.json();
                setGallery(data.gallery);
            }

            setLoading(false);
        }

        if (!shouldFetchGallery) {
            getGallery();
        } else {
            setLoading(false);
        }
    }, [userID, shouldFetchGallery]);

    return { gallery, setGallery, loading };
};

export const useSearchResults = (query) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        async function searchUsers() {
            const queryString = encodeURIComponent(query);

            const searchRes = await fetchData(`/users?search=${queryString}`, 'GET');

            if (searchRes instanceof Error || !searchRes.ok) {
                alert(SERVER_ERROR);
            } else {
                const { users } = await searchRes.json();
                setResults(users);
            }

            setLoading(false);
        }

        if (query) searchUsers();
        else setLoading(false);
    }, [query]);

    return { results, setResults, loading };
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

export const useTokenValidation = (type, token) => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [validating, setValidating] = useState(true);

    useEffect(() => {
        async function validateToken() {
            const validateRes = await fetchData(`/auth/${type}-tokens/${token}`, 'PUT');

            if (validateRes instanceof Error) {
                alert(SERVER_ERROR);
            } else if (validateRes.ok) {
                setIsValidToken(true);
            }

            setValidating(false);
        }

        validateToken();
    }, [type, token]);

    return { isValidToken, validating };
};

export const useIncomingFriendRequests = (user) => {
    const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);

    useEffect(() => {
        async function getIncomingFriendRequests() {
            const frRes = await fetchData(`/users/${user._id}/friends`);

            if (frRes instanceof Error) {
                alert(SERVER_ERROR);
            } else if (frRes.ok) {
                const data = await frRes.json();
                setIncomingFriendRequests(data.incomingRequests);
            }
        }

        if (user) getIncomingFriendRequests();
    }, [user]);

    return { incomingFriendRequests, setIncomingFriendRequests };
};

export const useSSE = (endpoint) => {
    const [notifications, setNotifications] = useState([]);
    const [eventSourceOpen, setEventSourceOpen] = useState(false);

    useEffect(() => {
        if (!eventSourceOpen) {
            const events = new EventSource(`${DOMAIN}${endpoint}`, { withCredentials: true });
            setEventSourceOpen(true);

            events.onmessage = (event) => {
                setNotifications((prev) => [...prev, JSON.parse(event.data)]);
            };
        }
    }, [endpoint, eventSourceOpen]);

    return { notifications, setNotifications };
};
