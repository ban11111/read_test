import { RouteComponentProps } from 'react-router'
import { UnregisterCallback, Href } from 'history'

const defauletState = { id: '1', roleId: 1, order_no: '1', customer_id: 1, mobile_id: 1, detail_type: 'my_orders' }

export const mockRouteProps = <T>(params: T, state?: any, pathname?: string): RouteComponentProps<T> => {
  return {
    match: {
      isExact: false,
      path: '',
      url: '',
      params: params
    },
    location: {
      hash: '',
      key: '',
      pathname: pathname || '',
      search: '',
      state: state || defauletState
    },
    history: {
      length: 2,
      action: 'POP',
      location: {
        hash: '',
        key: '',
        pathname: pathname || '',
        search: '',
        state: state || defauletState
      },
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      block: () => {
        var temp: UnregisterCallback = jest.fn()
        return temp
      },
      createHref: () => {
        var temp: Href = ''
        return temp
      },
      listen: () => {
        var temp: UnregisterCallback = jest.fn()
        return temp
      }
    },
    staticContext: {}
  }
}
