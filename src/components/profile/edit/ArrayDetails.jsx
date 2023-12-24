import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_ERROR } from '../../../helpers/constants';
import { fetchData } from '../../../helpers/fetch';
import { toYYYYMMDD } from '../../../helpers/util';
import buttonStyles from '../../buttons/css/button.module.css';
import { Input } from '../../inputs/Input';
import { VisibilitySelect } from '../../inputs/VisibilitySelect';
import { Loading } from '../../loading/Loading';
import errorStyles from '../../login/css/login.module.css';
import editStyles from '../css/edit.module.css';

export function ArrayDetails({ detailsType, setProfileUser }) {
    const { user, setUser } = useOutletContext();
    const [entries, setEntries] = useState(user.details[detailsType].value);
    const [loading, setLoading] = useState(false);
    const [editError, setEditError] = useState(null);

    function addNewEntry() {
        const newEntryTemplate = {
            id: Date.now().toString(),
            [detailsType === 'employment' ? 'title' : 'institution']: '',
            [detailsType === 'employment' ? 'company' : 'course']: '',
            start: null,
            end: null,
        };
        setEntries([...entries, newEntryTemplate]);
    }

    function removeEntry(removedID) {
        setEntries(entries.filter((entry) => entry.id !== removedID));
    }

    function resetEntries() {
        setEntries(user.details[detailsType].value);
    }

    function updateDetailsArray(e) {
        const clonedEntries = structuredClone(entries);
        const [field, entryID] = e.target.name.split('-');
        const editedEntry = clonedEntries.find((entry) => entry.id === entryID);
        editedEntry[field] = e.target.value || null;

        setEntries(clonedEntries);
    }

    async function submitChanges(e) {
        e.preventDefault();
        setLoading(true);
        setEditError(null);

        const formData = {
            [`${detailsType}`]: {
                value: entries,
                visibility: e.target.visibility.value,
            },
        };

        const editRes = await fetchData(`/users/${user._id}/${detailsType}`, 'PUT', {
            data: JSON.stringify(formData),
            asJSON: true,
        });

        if (editRes instanceof Error) {
            alert(SERVER_ERROR);
        } else if (!editRes.ok) {
            const { error } = await editRes.json();
            setEditError(error);
        } else {
            const data = await editRes.json();
            const clonedUser = structuredClone(user);
            clonedUser.details[detailsType].value = data[detailsType];
            clonedUser.details[detailsType].visibility = data.visibility;

            setUser(clonedUser);
            setProfileUser((prev) => {
                return {
                    ...prev,
                    ...(data.visibility !== 'hidden' && {
                        [`${detailsType}`]: data[detailsType],
                    }),
                };
            });
        }

        setLoading(false);
    }

    return (
        <form onSubmit={submitChanges} className={`${editStyles.form} ${editStyles.arrayForm}`}>
            {!entries.length ? (
                <p>You do not have any saved {detailsType} entries.</p>
            ) : (
                <>
                    {entries.map((entry) => (
                        <div key={entry.id} className={editStyles.entry}>
                            <button
                                type="button"
                                className={`${buttonStyles.bold} ${editStyles.remove}`}
                                onClick={() => removeEntry(entry.id)}
                                aria-label={`remove ${detailsType} entry`}
                            >
                                Remove
                            </button>
                            <Input
                                // name will not be used for form submission, only ID/labels
                                name={`${detailsType === 'employment' ? 'title' : 'institution'}-${
                                    entry.id
                                }`}
                                type="text"
                                labelText={detailsType === 'employment' ? 'Title' : 'Institution'}
                                ariaLabel={
                                    detailsType === 'employment'
                                        ? 'enter job title'
                                        : 'enter institution'
                                }
                                autoComplete="off"
                                defaultValue={
                                    detailsType === 'employment' ? entry.title : entry.institution
                                }
                                onInput={updateDetailsArray}
                                isRequired={true}
                            />
                            <Input
                                name={`${detailsType === 'employment' ? 'company' : 'course'}-${
                                    entry.id
                                }`}
                                type="text"
                                labelText={detailsType === 'employment' ? 'Company' : 'Course'}
                                ariaLabel={
                                    detailsType === 'employment' ? 'enter company' : 'enter course'
                                }
                                autoComplete="off"
                                defaultValue={
                                    detailsType === 'employment' ? entry.company : entry.course
                                }
                                onInput={updateDetailsArray}
                                isRequired={detailsType === 'employment'}
                            />
                            <Input
                                name={`start-${entry.id}`}
                                type="date"
                                labelText="Start date"
                                ariaLabel="enter start date"
                                autoComplete="off"
                                defaultValue={toYYYYMMDD(entry.start) ?? ''}
                                onInput={updateDetailsArray}
                                isRequired={true}
                            />
                            <Input
                                name={`end-${entry.id}`}
                                type="date"
                                labelText="End date"
                                ariaLabel="enter end date"
                                autoComplete="off"
                                defaultValue={toYYYYMMDD(entry.end) ?? ''}
                                onInput={updateDetailsArray}
                                isRequired={false}
                            />
                        </div>
                    ))}
                </>
            )}

            {editError && <p className={errorStyles.error}>{editError}</p>}

            <div className={editStyles.buttons}>
                <div>
                    <button type="button" className={buttonStyles.bold} onClick={addNewEntry}>
                        Add
                    </button>
                    <button type="button" className={buttonStyles.subtle} onClick={resetEntries}>
                        Reset
                    </button>
                </div>
                <div>
                    <VisibilitySelect
                        name="visibility"
                        defaultValue={user.details[detailsType].visibility}
                    />
                    <button type="submit" className={`${buttonStyles.bold} ${editStyles.submit}`}>
                        {loading ? <Loading isInButton={true} /> : 'Submit'}
                    </button>
                </div>
            </div>
        </form>
    );
}
