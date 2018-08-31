import {getMiddleware} from './src'

const middleware = getMiddleware(jest.fn(desiredResult => {
  if (desiredResult === 'SUCCEED') return Promise.resolve('SUCCESS')
  else return Promise.reject('FAILURE')
}))

describe('middleware', () => {
  const store = {
    dispatch: jest.fn()
  }
  const nextHandler = middleware(store)

  it('should return a function to handle next', () => {
    expect(nextHandler).toBeInstanceOf(Function)
  })

  describe('handle next', () => {
    const next = jest.fn()
    const actionHandler = nextHandler(next)

    it('should return a function to handle action', () => {
      expect(actionHandler).toBeInstanceOf(Function)
    })

    describe('handle action', () => {
      const regularAction = {type: 'ACTION'}

      it('should pass the original action to next', () => {
        actionHandler(regularAction)
        expect(next).toHaveBeenCalledWith(regularAction)
      })

      it('should dispatch a default action type if the request succeeds', async() => {
        const successfulAction = {type: 'ACTION', popsicle: 'SUCCEED'}
        await actionHandler(successfulAction)
        expect(store.dispatch).toHaveBeenCalledWith({type: '@@redux-popsicle/RESPONSE'})
      })

      it('should dispatch a default error action type if the request fails', async() => {
        const unsuccessfulAction = {type: 'ACTION', popsicle: 'FAIL'}
        await actionHandler(unsuccessfulAction)
        expect(next).toHaveBeenCalledWith(unsuccessfulAction)
        expect(store.dispatch).toHaveBeenCalledWith({type: '@@redux-popsicle/ERROR'})
      })

      describe('if response and error primitives are included in the action', () => {
        it('should dispatch the desired response', async() => {
          const successfulAction = {type: 'ACTION', popsicle: 'SUCCEED', response: 'SIMPLE_RESPONSE'}
          await actionHandler(successfulAction)
          expect(next).toHaveBeenCalledWith(successfulAction)
          expect(store.dispatch).toHaveBeenCalledWith('SIMPLE_RESPONSE')
        })

        it('should dispatch the desired error', async() => {
          const unsuccessfulAction = {type: 'ACTION', popsicle: 'FAIL', error: 'SIMPLE_ERROR'}
          await actionHandler(unsuccessfulAction)
          expect(next).toHaveBeenCalledWith(unsuccessfulAction)
          expect(store.dispatch).toHaveBeenCalledWith('SIMPLE_ERROR')
        })
      })

      describe('if response and error functions are included in the action', () => {
        const response = jest.fn(() => 'CREATED_RESPONSE')
        const error = jest.fn(() => 'CREATED_ERROR')

        it('should call the response function with the popsicle response body and dispatch the result', async() => {
          const successfulAction = {type: 'ACTION', popsicle: 'SUCCEED', response, error}
          await actionHandler(successfulAction)
          expect(next).toHaveBeenCalledWith(successfulAction)
          expect(response).toHaveBeenCalledWith('SUCCESS')
          expect(store.dispatch).toHaveBeenCalledWith('CREATED_RESPONSE')
          expect(error).not.toHaveBeenCalled()
        })

        it('should call the error function with the popsicle response error code dispatch the result', async() => {
          const unsuccessfulAction = {type: 'ACTION', popsicle: 'FAIL', response, error}
          await actionHandler(unsuccessfulAction)
          expect(next).toHaveBeenCalledWith(unsuccessfulAction)
          expect(error).toHaveBeenCalledWith('FAILURE')
          expect(store.dispatch).toHaveBeenCalledWith('CREATED_ERROR')
          expect(response).not.toHaveBeenCalled()
        })
      })
    })
  })
})
