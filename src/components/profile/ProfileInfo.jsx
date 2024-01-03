import { getEntryDateRange, toDateString } from '../../helpers/util';
import infoStyles from './css/info.module.css';

export function ProfileInfo({ profileUser }) {
    const detailsHidden = !profileUser.DOB && !profileUser.city && !profileUser.country;

    return (
        <div className={infoStyles.info}>
            <div className="sr-only" aria-live="polite">
                Now on profile info
            </div>

            <section>
                <div className={infoStyles.sectionHeading}>
                    <h2>Details</h2>
                </div>

                {detailsHidden ? (
                    <div className={infoStyles.hidden}>
                        This user does not have anything shown here.
                    </div>
                ) : (
                    <div className={infoStyles.entry}>
                        {profileUser.DOB && (
                            <div>
                                <span>Birthday: </span>
                                {toDateString(profileUser.DOB)}
                            </div>
                        )}
                        {profileUser.city && (
                            <div>
                                <span>City: </span>
                                {profileUser.city}
                            </div>
                        )}
                        {profileUser.country && (
                            <div>
                                <span>Country: </span>
                                {profileUser.country}
                            </div>
                        )}
                    </div>
                )}
            </section>

            <hr className={infoStyles.separator} />

            <section>
                <div className={infoStyles.sectionHeading}>
                    <h2>Employment</h2>
                </div>

                {!profileUser.employment || !profileUser.employment.length ? (
                    <div className={infoStyles.hidden}>
                        This user does not have anything shown here.
                    </div>
                ) : (
                    <>
                        {profileUser.employment.map((job, i) => (
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
                </div>

                {!profileUser.education || !profileUser.education.length ? (
                    <div className={infoStyles.hidden}>
                        This user does not have anything shown here.
                    </div>
                ) : (
                    <>
                        {profileUser.education.map((education, i) => (
                            <div key={i} className={infoStyles.entry}>
                                <h3>{education.institution}</h3>
                                {education.course && <p>{education.course}</p>}
                                <p>{getEntryDateRange(education.start, education.end)}</p>
                            </div>
                        ))}
                    </>
                )}
            </section>
        </div>
    );
}
