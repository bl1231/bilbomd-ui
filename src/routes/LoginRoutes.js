import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - Home
const Home = Loadable(lazy(() => import('components/Home')));

// render - login
// const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
// const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// prettier-ignore
const MagickLink = Loadable(lazy(() => import('features/auth/MagickLink')));
const Signup = Loadable(lazy(() => import('features/auth/Signup')));
// prettier-ignore
const VerifyUser = Loadable(lazy(() => import('features/auth/VerifyUser')));
// prettier-ignore
const MagickLinkAuth = Loadable(lazy(() => import('features/auth/MagickLinkAuth')));
const Unauthorized = Loadable(lazy(() => import('components/Unauthorized')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <Home />
    },
    {
      path: 'register',
      element: <Signup />
    },
    {
      path: 'verify/:code',
      element: <VerifyUser />
    },
    {
      path: 'magicklink',
      element: <MagickLink />
    },
    {
      path: 'auth/:otp',
      element: <MagickLinkAuth />
    },
    {
      path: 'login',
      element: <MagickLink />
    },
    {
      path: 'unauthorized',
      element: <Unauthorized />
    }
  ]
};

export default LoginRoutes;
