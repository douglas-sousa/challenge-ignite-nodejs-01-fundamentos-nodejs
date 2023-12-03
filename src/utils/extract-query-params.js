/**
 * @param {URLSearchParams} searchParams 
 */
function extractQueryParams (searchParams) {
    const objectParams = {};

    for (const [key, value] of searchParams) {
        const shouldAddValueToArray = !!objectParams[key];

        if (!shouldAddValueToArray) {
            objectParams[key] = value;
        } else {
            Array.isArray(objectParams[key])
                ? objectParams[key].push(value)
                : (objectParams[key] = [objectParams[key], value]);
        }
    }

    return objectParams;
}

export default extractQueryParams;
