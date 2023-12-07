import buttonStyles from './css/button.module.css';

export function RespondFR({ userID, action }) {
    return (
        <button className={buttonStyles[action === 'accept' ? 'bold' : 'subtle']}>
            {action === 'accept' ? 'Accept' : 'Decline'}
        </button>
    );
}
