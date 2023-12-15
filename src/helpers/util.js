import { dayNames, durations } from './constants';

export const getFirstName = (name) => {
    return name.split(' ')[0];
};

export const getFullNameFromDetails = (userDetails) => {
    return `${userDetails.firstName} ${userDetails.lastName}`;
};

export const toDateString = (ISOdate, hasDate = true) => {
    if (!ISOdate) return null;

    const date = new Date(ISOdate);
    const options = {
        month: 'long',
        year: 'numeric',
    };

    if (hasDate) options.day = 'numeric';

    return date.toLocaleDateString(navigator.languages[0], options);
};

export const getRelativeTimestamp = (timeString) => {
    const postDate = new Date(timeString);
    const postInMsSinceEpoch = postDate.getTime();
    const day = dayNames[postDate.getDay()];

    const time = postDate
        .toLocaleTimeString(navigator.languages[0], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
        .split(' ')
        .join('');

    const msSincePost = Date.now() - postInMsSinceEpoch;

    if (msSincePost < durations.ONE_MINUTE) {
        return 'Just now';
    } else if (msSincePost < durations.ONE_HOUR) {
        const elapsedTimeInMinutes = Math.ceil(msSincePost / durations.ONE_MINUTE);
        const minuteWord = elapsedTimeInMinutes === 1 ? 'minute' : 'minutes';

        return `${elapsedTimeInMinutes} ${minuteWord} ago`;
    } else if (msSincePost < durations.ONE_DAY) {
        const elapsedTimeInHours = Math.ceil(msSincePost / durations.ONE_HOUR);
        const hourWord = elapsedTimeInHours === 1 ? 'hour' : 'hours';

        return `${elapsedTimeInHours} ${hourWord} ago at ${time}`;
    } else if (msSincePost < durations.ONE_WEEK) {
        const elapsedTimeInDays = Math.ceil(msSincePost / durations.ONE_WEEK);

        const relativeTime =
            elapsedTimeInDays === 1 ? 'Yesterday' : `${elapsedTimeInDays} days ago`;

        return `${relativeTime} at ${time}`;
    } else {
        const dateString = postDate.toLocaleDateString(navigator.languages[0], {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });

        return `${day} ${dateString} at ${time}`;
    }
};

export const sortFriends = (friendsList) => {
    const incoming = friendsList.filter((friend) => friend.status === 'incoming');
    const requested = friendsList.filter((friend) => friend.status === 'requested');
    const accepted = friendsList.filter((friend) => friend.status === 'accepted');

    return [...incoming, ...requested, ...accepted];
};

export const getLocationSummary = (city, country) => {
    if (city && country) {
        return `From ${city}, ${country}`;
    } else if (city) {
        return `From ${city}`;
    } else {
        return `From ${country}`;
    }
};

export const getEducationSummary = (latestEducation) => {
    if (!latestEducation.end) {
        return `Studying at ${latestEducation.institution}`;
    } else {
        return `Studied at ${latestEducation.institution}`;
    }
};

export const getEmploymentSummary = (latestJob) => {
    if (!latestJob.end) {
        return `${latestJob.title} at ${latestJob.company}`;
    } else {
        return `Former ${latestJob.title} at ${latestJob.company}`;
    }
};

export const getEntryDateRange = (start, end) => {
    const startDate = toDateString(start, false);
    const endDate = toDateString(end, false) ?? 'present';

    return `${startDate} to ${endDate}`;
};

export const closeOnClickOutside = (e, modal) => {
    if (e.target === modal.current) {
        modal.current.close();
    }
};

export const updateSelfPostsProfilePicture = (
    userID,
    newProfilePicture,
    wallPosts,
    setWallPosts
) => {
    const newWallPosts = wallPosts.map((post) => {
        if (post.author._id === userID) {
            post.author.profilePicture = newProfilePicture;
        }

        return post;
    });

    setWallPosts(newWallPosts);
};

export const autoResizeTextarea = (e) => {
    const textarea = e.target;

    textarea.style.height = 'auto';
    // the +2 gets rid of the scrollbar
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
};
