import { dayNames, durations } from './constants';

export const getFirstName = (name) => {
    return name.split(' ')[0];
};

export const getFullNameFromDetails = (userDetails) => {
    return `${userDetails.firstName} ${userDetails.lastName}`;
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
