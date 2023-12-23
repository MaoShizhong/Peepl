import { getEntryDateRange, toDateString } from '../../helpers/util';
import infoStyles from './css/info.module.css';

export function ProfileInfo({ user }) {
    const detailsHidden = !user.DOB && !user.city && !user.country;

    return (
        <div className={infoStyles.info}>
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
        </div>
    );
}
