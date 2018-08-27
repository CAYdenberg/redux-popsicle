const popsicle = require('popsicle')

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
        return dispatch({type: '@@redux-popsicle/RESPONSE'})

      }).catch(status => {
        return dispatch({type: '@@redux-popsicle/ERROR'})
      })
    }
  }
}

export default getMiddleware(popsicleRequest)
