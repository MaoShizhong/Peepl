import infoStyles from './css/info.module.css';

export function ProfileInfo({ user }) {
    return (
        <div className={infoStyles.info}>
            <section>
                <div className={infoStyles.sectionHeading}>
                    <h2>Details</h2>
                    <button>Edit details</button>
                </div>
                <div></div>
            </section>

            <section>
                <div className={infoStyles.sectionHeading}>
                    <h2>Employment</h2>
                    <button>Edit employment</button>
                </div>
                <div></div>
            </section>

            <section>
                <div className={infoStyles.sectionHeading}>
                    <h2>Education</h2>
                    <button>Edit education</button>
                </div>
                <div></div>
            </section>
        </div>
    );
}
