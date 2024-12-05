import React from 'react'

interface ErrorFallbackProps {
  error: Error
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div role='alert'>
      <p>
        Something went wrong. Please send a screenshot of the error message to
        Scott.
      </p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

export default ErrorFallback
