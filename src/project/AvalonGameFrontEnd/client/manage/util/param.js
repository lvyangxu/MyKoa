export const buildParams = (state, json) => {
    let value = state.games.find(d => {
        return d.name === state.currentGame
    }).id
    json = Object.assign({}, json, {
        requestParams: [{id: "uiGame", value: value}],
    })
    return json
}