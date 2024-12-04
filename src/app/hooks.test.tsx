import { Provider } from 'react-redux'
import { setupStore } from './store'
import { useAppDispatch } from './hooks'
import { renderHook } from '@testing-library/react'

describe('useAppDispatch hook', () => {
  let store = setupStore()

  beforeEach(() => {
    store = setupStore()
  })

  it('should return the dispatch function', () => {
    const { result } = renderHook(() => useAppDispatch(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    })
    expect(result.current).toBe(store.dispatch)
  })
  it('should return useAppSelector hook', () => {
    const { result } = renderHook(() => useAppDispatch(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    })
    expect(result.current).toBe(store.dispatch)
  })
})
