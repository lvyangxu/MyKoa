import Ajax from "karl-ajax"
import "isomorphic-fetch"

export default async (action, props, data = {}) => {
    let jwt = localStorage.getItem(props.project + "-jwt")
    if (jwt === null) {
        location.href = "../login/"
        return
    }
    data.jwt = jwt
    // data = Object.assign({}, data, {path: `/table/${props.id}/${action}`})
    // return Ajax.post(`../api/${props.serviceName}`, data)
    let path = `/table/${props.id}/${action}`
    let response = await fetch(`../api/${props.serviceName}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            path: path
        })
    })
    let responseData = await response.json()
    let message = responseData.message
    return message
}