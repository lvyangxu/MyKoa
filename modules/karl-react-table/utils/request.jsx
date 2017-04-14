import {postWithJWT} from "karl-http"

export default (action, props, data = {}) => {
    let url = `../api/${props.serviceName}`
    let path = `/table/${props.id}/${action}`
    data = Object.assign({}, {path: path}, data)
    return postWithJWT(props.project, url, data)
}