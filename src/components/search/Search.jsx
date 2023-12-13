import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DEFAULT_PROFILE_PICTURE } from '../../helpers/constants';
import { useSearchResults } from '../../helpers/hooks';
import { SearchButton } from '../buttons/SearchButton';
import { Loading } from '../loading/Loading';
import searchStyles from './css/search.module.css';

export function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const goTo = useNavigate();

    const { results, loading } = useSearchResults(query);

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
                results.map((user) => (
                    <div key={user._id}>
                        <img
                            src={user.profilePicture ?? DEFAULT_PROFILE_PICTURE}
                            alt="search result profile picture thumbnail"
                        />

                        <Link to={`/${user.handle}`} reloadDocument>
                            {user.name}
                        </Link>
                    </div>
                ))
            )}
        </main>
    );
}
