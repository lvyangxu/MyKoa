import "isomorphic-fetch"

let doFetch = async (url, data, method = "POST") => {
    let promise = new Promise((resolve, reject) => {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(d => {
            return d.json()
        }).then(d => {
            if (d.success && d.hasOwnProperty("message")) {
                resolve(d.message)
            } else {
                reject(d)
            }
        }).catch(e => {
            reject(e)
        })
    })
    return promise
}

export const get = (url, data) => {
    return doFetch(url, data, "GET")
}

export const post = (url, data) => {
    return doFetch(url, data)
}

export const getWithJWT = (project, url, data) => {
    let jwt = localStorage.getItem(project + "-jwt")
    if (jwt === null) {
        location.href = "../login/"
        return
    }
    data = Object.assign({}, {jwt: jwt}, data)
    return get(url, data)
}

export const postWithJWT = (project, url, data) => {
    let jwt = localStorage.getItem(project + "-jwt")
    if (jwt === null) {
        location.href = "../login/"
        return
    }
    data = Object.assign({}, {jwt: jwt}, data)
    return post(url, data)
}

