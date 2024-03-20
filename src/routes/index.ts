import { useRoutes } from 'react-router-dom'

import { LoginRoutes } from './LoginRoutes'
import { ProtectedMainRoutes } from './MainRoutes'

export default function ThemeRoutes() {
  return useRoutes([LoginRoutes, ProtectedMainRoutes])
}
