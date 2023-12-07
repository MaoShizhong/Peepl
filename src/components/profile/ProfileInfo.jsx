import { useEffect, useRef, useState } from 'react';
import { getEntryDateRange, toDateString } from '../../helpers/util';
import { EditButton } from '../buttons/EditButton';
import infoStyles from './css/info.module.css';
import { EditDetails } from './edit_modals/EditDetails';
import { EditEducation } from './edit_modals/EditEducation';
import { EditEmployment } from './edit_modals/EditEmployment';

export function ProfileInfo({ user, isOwnProfile }) {
    const [currentOpenEditModal, setCurrentOpenEditModal] = useState(null);

    const modalRef = useRef(null);
    const detailsHidden = !user.DOB && !user.city && !user.country;

    useEffect(() => {
        if (modalRef.current) modalRef.current.showModal();
    }, [currentOpenEditModal]);

    return (
        <div className={infoStyles.info}>
            <section>
                <div className={infoStyles.sectionHeading}>
                    <h2>Details</h2>
                    {isOwnProfile && (
                        <EditButton
                            infoSection="details"
                            setOpenEditModal={setCurrentOpenEditModal}
                        />
                    )}
                </div>

                {detailsHidden ? (
                    <div className={infoStyles.hidden}>
                        This user does not have anything shown here.
                    </div>
                ) : (
                    <div className={infoStyles.entry}>
                        {user.DOB && (
                            <div>
                                <span>Birthday: </span>
                                {toDateString(user.DOB)}
                            </div>
                        )}
                        {user.city && (
                            <div>
                                <span>City: </span>
                                {user.city}
                            </div>
                        )}
                        {user.country && (
                            <div>
                                <span>Country: </span>
                                {user.country}
                            </div>
                        )}
                    </div>
                )}
            </section>

            <hr className={infoStyles.separator} />

            <section>
                <div className={infoStyles.sectionHeading}>
                    <h2>Employment</h2>
                    {isOwnProfile && (
                        <EditButton
                            infoSection="employment"
                            setOpenEditModal={setCurrentOpenEditModal}
                        />
                    )}
                </div>

                {!user.employment || !user.employment.length ? (
                    <div className={infoStyles.hidden}>
                        This user does not have anything shown here.
                    </div>
                ) : (
                    <>
                        {user.employment.map((job, i) => (
                            <div key={i} className={infoStyles.entry}>
                                <h3>{job.company}</h3>
                                <p>
                                    {job.title ? `${job.title} - ` : null}
                                    {getEntryDateRange(job.start, job.end)}
                                </p>
                            </div>
                        ))}
                    </>
                )}
            </section>

            <hr className={infoStyles.separator} />

            <section>
                <div className={infoStyles.sectionHeading}>
                    <h2>Education</h2>
                    {isOwnProfile && (
                        <EditButton
                            infoSection="education"
                            setOpenEditModal={setCurrentOpenEditModal}
                        />
                    )}
                </div>

                {!user.education || !user.education.length ? (
                    <div className={infoStyles.hidden}>
                        This user does not have anything shown here.
                    </div>
                ) : (
                    <>
                        {user.education.map((education, i) => (
                            <div key={i} className={infoStyles.entry}>
                                <h3>{education.institution}</h3>
                                {education.course && <p>{education.course}</p>}
                                <p>{getEntryDateRange(education.start, education.end)}</p>
                            </div>
                        ))}
                    </>
                )}
            </section>

            {currentOpenEditModal === 'details' && (
                <EditDetails
                    user={user}
                    setOpenEditModal={setCurrentOpenEditModal}
                    ref={modalRef}
                />
            )}
            {currentOpenEditModal === 'employment' && (
                <EditEmployment
                    user={user}
                    setOpenEditModal={setCurrentOpenEditModal}
                    ref={modalRef}
                />
            )}
            {currentOpenEditModal === 'education' && (
                <EditEducation
                    user={user}
                    setOpenEditModal={setCurrentOpenEditModal}
                    ref={modalRef}
                />
            )}
        </div>
    );
}
