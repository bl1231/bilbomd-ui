import Loadable from "components/Loadable"
import MinimalLayout from "layout/MinimalLayout"
import { lazy } from "react"

const Home = Loadable(lazy(() => import("components/Home")))
const MagickLink = Loadable(lazy(() => import("features/auth/MagickLink")))
const Signup = Loadable(lazy(() => import("features/auth/Signup")))
const VerifyEmail = Loadable(lazy(() => import("features/auth/VerifyEmail")))
const MagickLinkAuth = Loadable(
  lazy(() => import("features/auth/MagickLinkAuth")),
)

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  element: <MinimalLayout />,
  path: "/",
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "register",
      element: <Signup />,
    },
    {
      path: "verify/:code",
      element: <VerifyEmail />,
    },
    {
      path: "magicklink",
      element: <MagickLink />,
    },
    {
      path: "auth/:otp",
      element: <MagickLinkAuth />,
    },
    {
      path: "login",
      element: <MagickLink />,
    },
  ],
}

export { LoginRoutes }
