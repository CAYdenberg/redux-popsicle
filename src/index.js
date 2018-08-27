const popsicle = require('popsicle')

export const popsicleRequest = ticket => {
  return popsicle.request(ticket)
    .use(popsicle.plugins.parse('json'))
    .then(res => res.status < 400 ? res.body : Promise.reject(res.status))
}

export function getMiddleware(doRequest = popsicleRequest) {
  return () => next => action => {
    if (action.popsicle) {
      doRequest(action.popsicle).then(body => {
        return next(action.response(body, action))
      }).catch(status => {
        return next({type: action.error || '@@POPSICLE/ERROR', status})
      })
    }

    return next(action)
  }
}

export default getMiddleware(popsicleRequest)
