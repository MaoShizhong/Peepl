import errorStyles from './css/error.module.css';

export function Error404({ resource }) {
    return (
        <div aria-live="polite" className={errorStyles.error404}>
            <span>404</span>
            {resource} not found
        </div>
    );
}
