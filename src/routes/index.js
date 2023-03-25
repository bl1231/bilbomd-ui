import { useRoutes } from 'react-router-dom'

import LoginRoutes from './LoginRoutes'
import { MainRoutes, ProtectedMainRoutes } from './MainRoutes'

// ==============================|| ROUTING RENDER ||============================== //

// export function PublicRoutes() {
//   return useRoutes([LoginRoutes]);
// }

// export function PrivateRoutes() {
//   return useRoutes([MainRoutes]);
// }

export default function ThemeRoutes() {
  return useRoutes([LoginRoutes, ProtectedMainRoutes])
}
