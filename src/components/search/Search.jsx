import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchButton } from '../buttons/SearchButton';
import searchStyles from './css/search.module.css';

export function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const goTo = useNavigate();

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
        </main>
    );
}
