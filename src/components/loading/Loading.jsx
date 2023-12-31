import styles from './css/loading.module.css';

export function Loading({ text, isInButton, isSplash }) {
    return (
        <>
            {isInButton ? (
                <Spinner />
            ) : isSplash ? (
                <div className={`${styles.container} ${styles.splash}`}>
                    <img src="/logo.png" alt="splash screen logo" />
                    <Spinner />
                </div>
            ) : (
                <div className={styles.container}>
                    <Spinner />
                    <p className={styles.text}>{text}</p>
                </div>
            )}
        </>
    );
}

function Spinner() {
    return (
        <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            className={styles.spinner}
            fill="currentColor"
        >
            <path
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                opacity=".25"
            />
            <circle cx="12" cy="2.5" r="1.5" />
        </svg>
    );
}
