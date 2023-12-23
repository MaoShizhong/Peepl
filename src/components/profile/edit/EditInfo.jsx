import { useState } from 'react';
import editStyles from '../css/edit.module.css';
import { ArrayDetails } from './ArrayDetails';
import { Details } from './Details';

const SECTIONS = { details: true, employment: false, education: false };

export function EditInfo() {
    const [expandedSections, setExpandedSections] = useState(SECTIONS);

    return (
        <div>
            {Object.keys(SECTIONS).map((section, i) => {
                const isExpanded = expandedSections[section];

                return (
                    <section key={i} className={editStyles[section]}>
                        <div className={editStyles.sectionHeading}>
                            <h2>
                                {section[0].toUpperCase()}
                                {section.slice(1)}
                            </h2>
                            <button
                                onClick={() =>
                                    setExpandedSections({
                                        ...expandedSections,
                                        [section]: !expandedSections[section],
                                    })
                                }
                                aria-label={
                                    isExpanded
                                        ? `collapse ${section} section`
                                        : `expand ${section} section`
                                }
                            >
                                {isExpanded ? <TriangleUp /> : <TriangleDown />}
                            </button>
                            <hr />
                        </div>
                        {section === 'details' && isExpanded && <Details />}
                        {section !== 'details' && isExpanded && (
                            <ArrayDetails detailsType={section} />
                        )}
                    </section>
                );
            })}
        </div>
    );
}

function TriangleUp() {
    return (
        <svg fill="#000000" viewBox="0 -3 24 24" width="22px" height="22px">
            <g>
                <path d="M18.5,15.5l-6-7l-6,7H18.5z"></path>
                <rect width="24" height="24" fill="none"></rect>
                <rect width="24" height="24" fill="none"></rect>
            </g>
        </svg>
    );
}

function TriangleDown() {
    return (
        <svg fill="#000000" viewBox="0 -3 24 24" width="22px" height="22px">
            <g>
                <path d="M6.5,8.5l6,7l6-7H6.5z"></path>
                <rect width="24" height="24" fill="none"></rect>
                <rect width="24" height="24" fill="none"></rect>
            </g>
        </svg>
    );
}
