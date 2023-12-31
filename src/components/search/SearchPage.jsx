import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useSearchResults } from '../../helpers/hooks';
import { AddFriend, RemoveFriend, RespondFR, SearchButton } from '../buttons/buttons';
import { Loading } from '../loading/Loading';
import searchStyles from './css/search.module.css';

export function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const goTo = useNavigate();

    const { results, setResults, loading } = useSearchResults(query);

    function goToSearchResults(e) {
        e.preventDefault();

        const newQuery = e.target.search.value.trim();
        if (newQuery) {
            goTo(`/search?q=${encodeURI(newQuery)}`);
        } else {
            goTo('/search');
        }
    }

    return (
        <main className={searchStyles.main}>
            <form onSubmit={goToSearchResults} className={searchStyles.form}>
                <label htmlFor="mainSearch">Search Peepl</label>
                <div className={searchStyles.bar}>
                    <input
                        type="search"
                        name="search"
                        id="mainSearch"
                        aria-label="search peepl"
                        placeholder="Search"
                        defaultValue={query}
                        className={searchStyles.input}
                        required
                    />
                    <SearchButton header={false} />
                </div>
            </form>

            {loading ? (
                <Loading />
            ) : (
                <div className={searchStyles.results}>
                    <h1>Results</h1>

                    {!results.length ? (
                        <div className={searchStyles.noResults}>No users found!</div>
                    ) : (
                        results.map((user) => (
                            <div key={user._id} className={searchStyles.user}>
                                <Link to={`/${user.handle}`}>
                                    <img
                                        src={user.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                                        alt="search result profile picture thumbnail"
                                    />
                                </Link>

                                <Link to={`/${user.handle}`} className={searchStyles.name}>
                                    {user.name}
                                </Link>

                                {user.status === 'accepted' ? (
                                    <RemoveFriend
                                        userID={user._id}
                                        setFriendsList={setResults}
                                        page="search"
                                    />
                                ) : user.status === 'requested' ? (
                                    <div>Pending...</div>
                                ) : user.status === 'incoming' ? (
                                    <>
                                        <RespondFR
                                            userID={user._id}
                                            action="accept"
                                            setFriendsList={setResults}
                                            page="search"
                                        />
                                        <RespondFR
                                            userID={user._id}
                                            action="reject"
                                            setFriendsList={setResults}
                                            page="search"
                                        />
                                    </>
                                ) : (
                                    <AddFriend userID={user._id} setUserList={setResults} />
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </main>
    );
}
