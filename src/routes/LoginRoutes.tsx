import Loadable from 'components/Loadable'
import MinimalLayout from 'layout/MinimalLayout'
import { lazy } from 'react'

const Home = Loadable(lazy(() => import('components/Home')))
const MagickLink = Loadable(lazy(() => import('features/auth/MagickLink')))
const Signup = Loadable(lazy(() => import('features/auth/Signup')))
const VerifyEmail = Loadable(lazy(() => import('features/auth/VerifyEmail')))
const MagickLinkAuth = Loadable(
  lazy(() => import('features/auth/MagickLinkAuth'))
)
const Login = Loadable(lazy(() => import('features/auth/Login')))
const OrcidConfirmation = Loadable(
  lazy(() => import('features/auth/OrcidConfirmation'))
)
const OrcidError = Loadable(lazy(() => import('features/auth/OrcidError')))

const LoginRoutes = {
  element: <MinimalLayout />,
  path: '/',
  children: [
    {
      index: true,
      element: <Home />
    },
    {
      path: 'register',
      element: <Signup />
    },
    {
      path: 'verify/:code',
      element: <VerifyEmail />
    },
    {
      path: 'magicklink',
      element: <MagickLink />
    },
    {
      path: 'auth/orcid-confirmation',
      element: <OrcidConfirmation />
    },
    {
      path: 'auth/orcid-error',
      element: <OrcidError />
    },
    {
      path: 'auth/:otp',
      element: <MagickLinkAuth />
    },
    {
      path: 'login',
      element: <Login />
    }
  ]
}

export { LoginRoutes }
