export const DEFAULT_PROFILE_PICTURE =
    'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg';

export const durations = {
    ONE_MINUTE: 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
    ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
};

export const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

export const ACCEPTED_FILE_TYPES = ['.jpg', '.jpeg', '.png', '.webp'];

export const UPLOAD_SIZE_LIMIT = 8388608;

export const UPLOAD_SIZE_LIMIT_MB = UPLOAD_SIZE_LIMIT / 1024 ** 2;

export const SERVER_ERROR = 'Something went wrong with the server, please try again later!';

export const MOBILE_BREAKPOINT_PX = 550;