import { Link, useSearchParams } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useSearchResults } from '../../helpers/hooks';
import { AddFriend, RemoveFriend, RespondFR } from '../buttons/buttons';
import { Loading } from '../loading/Loading';
import searchStyles from './css/search.module.css';

export function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const { results, setResults, loading } = useSearchResults(query);

    return (
        <main className={searchStyles.main}>
            {loading ? (
                <Loading />
            ) : (
                <div className={searchStyles.results}>
                    <div className="sr-only" aria-live="polite">
                        Search results for {query}. {results.length}{' '}
                        {results.length === 1 ? 'match' : 'matches'} found
                    </div>

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
