import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../helpers/constants';
import { fetchData } from '../../helpers/fetch';
import galleryStyles from './css/gallery.module.css';

export function ToggleGalleryVisiblity({ isGalleryHidden, setProfileUser }) {
    const { user } = useOutletContext();

    async function changeVisibility(e) {
        console.log(e.target.value);
        const checkValue = isGalleryHidden ? 'hidden' : 'visible';

        /*
            Could have just used a simple toggle button but felt a select would
            be a nicer touch. API endpoint toggles automatically when requested.
            Therefore, this check is to prevent toggling in the very rare case
            that the gallery is hidden but the select shows "visible" and is then
            changed to "hidden" (which would otherwise cause the API to toggle
            to "visible" despite "hidden" being selected).
        */
        if (e.target.value === checkValue) return;

        const toggleRes = await fetchData(`/users/${user._id}/gallery`, 'PATCH');

        if (toggleRes instanceof Error || !toggleRes.ok) {
            alert(SERVER_ERROR);
        } else {
            const { galleryIsHidden } = await toggleRes.json();
            alert(`Gallery visibility set to: ${galleryIsHidden ? 'hidden' : 'visible'}`);
            setProfileUser((prev) => {
                const clonedUser = structuredClone(prev);
                clonedUser.galleryIsHidden = galleryIsHidden;
                return clonedUser;
            });
        }
    }

    return (
        <div className={galleryStyles.visibility}>
            <label htmlFor="gallery-visibility">Visibility:</label>
            <select
                id="gallery-visibility"
                defaultValue={isGalleryHidden ? 'hidden' : 'visible'}
                onChange={changeVisibility}
            >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
            </select>
        </div>
    );
}
