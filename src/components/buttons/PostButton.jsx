import { Loading } from '../loading/Loading';
import buttonStyles from './css/button.module.css';

export function PostButton({ contentType, loading }) {
    return (
        <button
            type="submit"
            className={buttonStyles.bold}
            aria-label={`Post ${contentType}`}
            disabled={loading}
        >
            {loading ? <Loading isInButton={true} /> : 'Post'}
        </button>
    );
}
