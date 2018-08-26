import getMiddleware from '../src'

const middleware = getMiddleware(jest.fn(desiredResult => {
  if (desiredResult === 'SUCCEED') return Promise.resolve('SUCCESS')
  else return Promise.reject('FAILURE')
}))

describe('middleware', () => {
  it('should return a function to handle next')

  describe('handle next', () => {
    it('should return a function to handle action')

    describe('handle action', () => {
      it('should pass the original action to next')

      it('should call next with a default action type if the request succeeds')

      it('should call next with a default error action type if the request fails')

      describe('if response and error primitives are included in the action', () => {
        it('should call next with the desired response')

        it('should call next with the desired error')
      })

      describe('if response and error functions are included in the action', () => {
        it('should call the response function with the popsicle response body and then call next with the result of that action')

        it('should call the error function with the popsicle response error code and then call next with the result of that action')
      })
    })
  })
})
