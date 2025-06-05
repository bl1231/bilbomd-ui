export interface FrontendBullMQJob<T = Record<string, unknown>> {
  id: string
  name: string
  data: T
  status: string
  timestamp: number
  attemptsMade: number
  lockExpiresAt: number | null
}
