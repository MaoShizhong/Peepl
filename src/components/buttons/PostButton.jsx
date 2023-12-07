import buttonStyles from './css/button.module.css';

export function PostButton() {
    return (
        <button type="submit" className={buttonStyles.bold}>
            Post
        </button>
    );
}
