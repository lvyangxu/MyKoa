import "isomorphic-fetch"

export default async (action, props, data = {}) => {
    let jwt = localStorage.getItem(props.project + "-jwt")
    if (jwt === null) {
        location.href = "../login/"
        return
    }
    data.jwt = jwt
    let path = `/table/${props.id}/${action}`
    data = Object.assign({}, {path: path}, data)
    let response = await fetch(`../api/${props.serviceName}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let responseData = await response.json()


    let message = responseData.message
    return message
}