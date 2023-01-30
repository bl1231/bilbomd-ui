import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
// const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
// const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

const MagickLink = Loadable(lazy(() => import('components/Auth/MagickLink')));
const Signup = Loadable(lazy(() => import('components/Auth/Signup')));
const VerifyUser = Loadable(lazy(() => import('components/Auth/VerifyUser')));
const MagickLinkAuth = Loadable(
  lazy(() => import('components/Auth/MagickLinkAuth'))
);
const Unauthorized = Loadable(lazy(() => import('components/Unauthorized')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
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
