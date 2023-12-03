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

            const res = await fetchData('/auth/sessions', 'GET');

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

export const useProfile = (_id) => {
    const [profileUser, setProfileUser] = useState(null);
    const [friendsList, setFriendsList] = useState([]);
    const [wallPosts, setWallPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getProfile() {
            const [userRes, friendsRes, wallRes] = await Promise.all([
                fetchData(`/users/${_id}`, 'GET'),
                fetchData(`/users/${_id}/friends`, 'GET'),
                fetchData(`/users/${_id}/posts`, 'GET'),
            ]);

            if ([userRes, friendsRes, wallRes].some((res) => res instanceof Error || !res.ok)) {
                alert('Something went wrong with the server, please try again later!');
            } else {
                const [userData, friendsData, wallData] = await Promise.all([
                    userRes.json(),
                    friendsRes.json(),
                    wallRes.json(),
                ]);

                setProfileUser(userData);
                setFriendsList(friendsData);
                setWallPosts(wallData);
            }

            setLoading(false);
        }

        getProfile();
    }, [_id]);

    return { profileUser, friendsList, wallPosts, loading };
};
