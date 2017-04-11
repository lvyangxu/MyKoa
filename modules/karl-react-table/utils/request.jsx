import Ajax from "karl-ajax"

export default async (action, props, data = {}) => {
    let jwt = localStorage.getItem(props.project + "-jwt")
    if (jwt === null) {
        location.href = "../login/"
        return
    }
    data.jwt = jwt
    data = Object.assign({}, data, {path: `/table/${props.id}/${action}`})
    return Ajax.post(`../api/${props.serviceName}`, data)
}