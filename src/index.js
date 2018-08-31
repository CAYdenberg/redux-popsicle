const popsicle = require('popsicle')

const DEFAULT_RESPONSE = '@@redux-popsicle/RESPONSE'
const DEFAULT_ERROR = '@@redux-popsicle/ERROR'

export const popsicleRequest = ticket => {
  return popsicle.request(ticket)
    .use(popsicle.plugins.parse('json'))
    .then(res => res.status < 400 ? res.body : Promise.reject(res.status))
}

export function getMiddleware(doRequest = popsicleRequest) {
  return store => next => action => {
    next(action)

    if (action.popsicle) {
      const {dispatch} = store

      return doRequest(action.popsicle).then(body => {
        if (action.response && typeof action.response === 'function') {
          return dispatch(action.response(body))
        }
        if (action.response) {
          return dispatch(action.response)
        }
        return dispatch({type: DEFAULT_RESPONSE})
      }).catch(status => {
        if (action.error && typeof action.error === 'function') {
          return dispatch(action.error(status))
        }
        if (action.error) {
          return dispatch(action.error)
        }
        return dispatch({type: DEFAULT_ERROR})
      })
    }
  }
}

export default getMiddleware(popsicleRequest)
