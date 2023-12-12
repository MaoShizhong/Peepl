const domain =
    import.meta.env.VITE_MODE === 'prod'
        ? import.meta.env.VITE_PROD_API
        : import.meta.env.VITE_DEV_API;

/**
 *
 * @param {string} endpoint
 * @param {('GET'|'POST'|'PUT'|'PATCH'|'DELETE')} method
 * @param {Object} [form]
 * @param {Object} form.data
 * @param {boolean} [form.hasFile]
 * @returns {(Promise<Response|Error>)}
 */
export const fetchData = async (endpoint, method, form) => {
    const options = {
        credentials: 'include',
        method: method,
    };

    // form.data will be FormData object - convert to urlencoded if no file present
    if (form && form.hasFile) options.body = form.data;
    else if (form && !form.hasFile) options.body = new URLSearchParams(form.data);

    try {
        return await fetch(`${domain}${endpoint}`, options);
    } catch (err) {
        return err;
    }
};
