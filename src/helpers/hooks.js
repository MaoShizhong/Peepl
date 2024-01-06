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

export const useProfile = (handle, destinationHandle) => {
    const [profileUser, setProfileUser] = useState(null);
    const [friendsList, setFriendsList] = useState([]);
    const [wallPosts, setWallPosts] = useState([]);
    const [wallPostPageToFetch, setWallPostPageToFetch] = useState(1);
    const [hasMoreWallPosts, setHasMoreWallPosts] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error404, setError404] = useState(false);

    useEffect(() => {
        async function getProfile() {
            // Due to pagination "appending" new wall posts to prev, going from
            // one profile to new profile requires this to prevent old state
            // from carrying over, showing unintended posts on wall
            if (handle === destinationHandle) {
                setWallPosts(() => []);
            }
            setLoading(true);

            const profileRes = await fetchData(
                `/users/${handle}?page=${wallPostPageToFetch}`,
                'GET'
            );

            if (profileRes instanceof Error) {
                alert(SERVER_ERROR);
            } else if (!profileRes.ok) {
                setError404(true);
            } else {
                const profileData = await profileRes.json();

                setProfileUser(profileData.user);
                setFriendsList(profileData.friends);
                setWallPosts((prev) => [...prev, ...profileData.wall]);
                setHasMoreWallPosts(profileData.hasMorePosts);
            }

            setLoading(false);
        }

        getProfile();
        // ! `posts` not included otherwise it will cause an infinite loop
        // ! setState callback arg not used else dev strict mode causes duplicate setState queueing
    }, [handle, wallPostPageToFetch]); // eslint-disable-line

    return {
        profileUser,
        setProfileUser,
        friendsList,
        setFriendsList,
        wallPosts,
        setWallPosts,
        setWallPostPageToFetch,
        hasMoreWallPosts,
        loading,
        error404,
    };
};

export const useFeed = (userID) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageToFetch, setPageToFetch] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(false);

    useEffect(() => {
        async function getFeed() {
            setLoading(true);

            const feedRes = await fetchData(`/users/${userID}/feed?page=${pageToFetch}`, 'GET');

            if (feedRes instanceof Error || !feedRes.ok) {
                alert(SERVER_ERROR);
            } else {
                const data = await feedRes.json();
                setPosts([...posts, ...data.feed]);
                setHasMorePosts(data.hasMorePosts);
            }

            setLoading(false);
        }

        getFeed();

        // ! `posts` not included otherwise it will cause an infinite loop
        // ! setState callback arg not used else dev strict mode causes duplicate setState queueing
    }, [userID, pageToFetch]); // eslint-disable-line

    return { posts, setPosts, setPageToFetch, hasMorePosts, loading };
};

export const useGallery = (userID, shouldFetchGallery) => {
    const [gallery, setGallery] = useState([]);
    const [pageToFetch, setPageToFetch] = useState(1);
    const [hasMorePhotos, setHasMorePhotos] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getGallery() {
            const galleryRes = await fetchData(
                `/users/${userID}/gallery?page=${pageToFetch}`,
                'GET'
            );

            if (galleryRes instanceof Error || !galleryRes.ok) {
                alert(SERVER_ERROR);
            } else {
                const data = await galleryRes.json();
                setGallery([...gallery, ...data.gallery]);
                setHasMorePhotos(data.hasMorePhotos);
            }

            setLoading(false);
        }

        if (!shouldFetchGallery) {
            getGallery();
        } else {
            setLoading(false);
        }
        // ! `posts` not included otherwise it will cause an infinite loop
        // ! setState callback arg not used else dev strict mode causes duplicate setState queueing
    }, [userID, shouldFetchGallery, pageToFetch]); // eslint-disable-line

    return { gallery, setGallery, setPageToFetch, hasMorePhotos, loading };
};

export const usePaginatedFetch = (hasMoreResults, setPageToFetch, loading) => {
    useEffect(() => {
        function fetchAdditionalPostsAtBottomOfFeed() {
            const currentScrollPosition = window.scrollY + window.innerHeight;
            const isAtBottom = currentScrollPosition >= document.body.scrollHeight;

            if (isAtBottom && hasMoreResults && !loading) {
                setPageToFetch((prev) => prev + 1);
            }
        }

        window.addEventListener('scroll', fetchAdditionalPostsAtBottomOfFeed);

        return () => window.removeEventListener('scroll', fetchAdditionalPostsAtBottomOfFeed);
    }, [hasMoreResults, setPageToFetch, loading]);
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

    return { results, setResults, loading, setLoading };
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

    useEffect(() => {
        const events = new EventSource(`${DOMAIN}${endpoint}`, { withCredentials: true });
        events.onmessage = (event) => {
            if (event.data === 'ping') return;

            setNotifications((prev) => [...prev, JSON.parse(event.data)]);
        };

        return () => events.close();
    }, [endpoint]);

    return { notifications, setNotifications };
};
