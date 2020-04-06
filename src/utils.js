// https://stackoverflow.com/questions/111529/how-to-create-query-parameters-in-javascript
export function encodeData(data) {
    return Object.keys(data)
        .map(function(key) {
            if (data[key] == null) return ''

            return [key, data[key]].map(encodeURIComponent).join('=')
        })
        .join('&')
}

// https://stackoverflow.com/a/2117523
export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    )
}
