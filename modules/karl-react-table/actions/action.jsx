import request from "../utils/request"

export const INIT = "INIT"
export const CHANGE_ROW_FILTER = "CHANGE_ROW_FILTER"
export const CHANGE_COLUMN_FILTER = "CHANGE_COLUMN_FILTER"
export const CHANGE_PAGE_INDEX = "CHANGE_PAGE_INDEX"
export const READ_START = "READ_START"
export const READ_SUCCESS = "READ_SUCCESS"
export const READ_FAILURE = "READ_FAILURE"
export const START_LOADING = "START_LOADING"
export const END_LOADING = "END_LOADING"

export function READ(props) {
    return async dispatch => {
        dispatch({type: START_LOADING})
        try {
            let data = await request("read", props)
            console.log(data)
            dispatch({type: END_LOADING})
        } catch (e) {
            dispatch({type: END_LOADING})
            console.log(e)
        }
    }
}