export function Gallery({ userID, isHidden, isOwnProfile }) {
    return (
        <div>
            {isOwnProfile || !isHidden
                ? 'Gallery'
                : 'This user has chosen to make their gallery visible only to friends.'}
        </div>
    );
}
