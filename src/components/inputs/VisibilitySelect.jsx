export function VisibilitySelect({ name, defaultValue }) {
    return (
        <label>
            Visibility:{' '}
            <select name={name} defaultValue={defaultValue}>
                <option value="everyone">Everyone</option>
                <option value="friends">Friends</option>
                <option value="hidden">Hidden</option>
            </select>
        </label>
    );
}
