export const DOMAIN =
    import.meta.env.VITE_MODE === 'prod'
        ? import.meta.env.VITE_PROD_API
        : import.meta.env.VITE_DEV_API;

/**
 *
 * @param {string} endpoint
 * @param {('GET'|'POST'|'PUT'|'PATCH'|'DELETE')} method
 * @param {Object} [form]
 * @param {FormData} [form.data]
 * @param {boolean} [form.urlEncoded]
 * @param {boolean} [form.asJSON]
 * @returns {(Promise<Response|Error>)}
 */
export const fetchData = async (endpoint, method, form) => {
    const options = {
        credentials: 'include',
        method: method,
    };

    /*
        No content type set when file present to allow browser to automatically
        set the correct multipart content type (bugs if manually setting multipart).
        Login form will be urlencoded as form.data is FormData and the backend is
        not equipped to process multipart data for login only (and it would not
        make sense to use multer for such a purpose)
    */
    if (form) {
        if (form.urlEncoded) {
            options.body = new URLSearchParams(form.data);
        } else if (form.asJSON) {
            options.body = form.data;
            options.headers = {
                'Content-Type': 'application/json',
            };
        } else {
            options.body = form.data;
        }
    }

    try {
        return await fetch(`${DOMAIN}${endpoint}`, options);
    } catch (err) {
        return err;
    }
};
