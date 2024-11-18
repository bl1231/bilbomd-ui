import { apiSlice } from './api/apiSlice'
import { superfacilityApiSlice } from './api/sfapiSlice'
import { setupStore, RootState } from './store' // Adjust path if necessary

describe('Redux Store', () => {
  let store: ReturnType<typeof setupStore>

  beforeEach(() => {
    // Initialize a new store instance before each test
    store = setupStore()
  })

  it('should create a store with the correct reducers', () => {
    const state = store.getState()

    expect(state).toHaveProperty(apiSlice.reducerPath)
    expect(state).toHaveProperty(superfacilityApiSlice.reducerPath)
    expect(state).toHaveProperty('auth')
  })

  it('should initialize with preloaded state', () => {
    // Update preloaded state to match actual auth state structure
    const preloadedState: Partial<RootState> = {
      auth: {
        token: 'fake-token'
      }
    }

    const preloadedStore = setupStore(preloadedState)
    const state = preloadedStore.getState()

    expect(state.auth.token).toBe('fake-token')
  })
})
