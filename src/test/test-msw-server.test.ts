test('MSW intercepts /api/v1/users', async () => {
  const response = await fetch('/api/v1/users')
  const data = await response.json()

  expect(data).toEqual({
    success: true,
    data: [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' }
    ]
  })
})
