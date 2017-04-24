import "isomorphic-fetch"

let doFetch = async (url, data, method = "POST", timeout = 10000) => {
    let promise = new Promise((resolve, reject) => {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(d => {
            if (d.status !== 200) {
                reject({status: d.status})
            }
            return d.json()
        }).then(d => {
            if (d.success && d.hasOwnProperty("message")) {
                resolve(d.message)
            } else {
                reject({status: 200, message: d})
            }
        }).catch(e => {
            reject(e)
        })
        setTimeout(() => {
            reject({status: 200, message: "request time out"})
        }, timeout)

    })
    return promise
}

export const get = (url, data, timeout) => {
    return doFetch(url, data, "GET", timeout)
}

export const post = (url, data, timeout) => {
    return doFetch(url, data, "POST", timeout)
}

export const getWithJWT = (project, url, data, timeout) => {
    let jwt = localStorage.getItem(project + "-jwt")
    if (jwt === null) {
        location.href = "../login/"
        return
    }
    data = Object.assign({}, {jwt: jwt}, data)
    return get(url, data, timeout)
}

export const postWithJWT = (project, url, data, timeout) => {
    let jwt = localStorage.getItem(project + "-jwt")
    if (jwt === null) {
        location.href = "../login/"
        return
    }
    data = Object.assign({}, {jwt: jwt}, data)
    return post(url, data, timeout)
}

