import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// Add logging middleware
server.events.on('request:start', (req) => {
  console.log(`👉 Request started: ${req.request.method} ${req.request.url}`)
})

server.events.on('request:match', (req) => {
  console.log(`✅ Request matched: ${req.request.method} ${req.request.url}`)
})

server.events.on('request:unhandled', (req) => {
  console.warn(`⚠️ Unhandled request: ${req.request.method} ${req.request.url}`)
})

server.events.on('response:mocked', (res) => {
  console.log(
    `🧩 Mocked response sent: ${res.response.status} ${res.response.url}`
  )
})

server.events.on('response:bypass', (req) => {
  console.log(`⛔ Request bypassed: ${req.request.method} ${req.request.url}`)
})
