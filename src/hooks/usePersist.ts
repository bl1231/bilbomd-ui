import { useState, useEffect } from 'react'

const usePersist = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [persist, setPersist] = useState<boolean>(
    JSON.parse(localStorage.getItem('persist') as string) || false
  )

  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist))
  }, [persist])

  return [persist, setPersist]
}

export default usePersist
