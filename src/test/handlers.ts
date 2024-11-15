import { http } from 'msw'

interface User {
  id: string
  name: string
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' }
]

export const handlers = [
  http.get('/api/v1/users', () => {
    return new Response(
      JSON.stringify({
        success: true, // Aligns with validateStatus in usersApiSlice
        data: mockUsers // Matches transformResponse expectation
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  })
]
