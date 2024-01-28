export const DOMAIN =
    import.meta.env.VITE_MODE === 'prod'
        ? import.meta.env.VITE_PROD_API
        : import.meta.env.VITE_DEV_API;

/**
 *
 * @param {string} endpoint
 * @param {('GET'|'POST'|'PUT'|'PATCH'|'DELETE')} method
 * @param {Object} [options]
 * @param {FormData} [options.data]
 * @param {boolean} [options.urlEncoded]
 * @param {boolean} [options.asJSON]
 * @param {AbortSignal} [options.signal]
 * @returns {(Promise<Response|Error>)}
 */
export const fetchData = async (endpoint, method, options) => {
    const fetchOptions = {
        credentials: 'include',
        method: method,
        signal: options?.signal,
    };

    /*
        No content type set when file present to allow browser to automatically
        set the correct multipart content type (bugs if manually setting multipart).
        Login form will be urlencoded as form.data is FormData and the backend is
        not equipped to process multipart data for login only (and it would not
        make sense to use multer for such a purpose)
    */
    if (options) {
        if (options.urlEncoded) {
            fetchOptions.body = new URLSearchParams(options.data);
        } else if (options.asJSON) {
            fetchOptions.body = options.data;
            fetchOptions.headers = {
                'Content-Type': 'application/json',
            };
        } else {
            fetchOptions.body = options.data;
        }
    }

    try {
        return await fetch(`${DOMAIN}${endpoint}`, fetchOptions);
    } catch (err) {
        return err;
    }
};
