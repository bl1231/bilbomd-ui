import { createBrowserRouter } from "react-router-dom";
import Root from "components/Root";
import Register from "components/Register";
import SignIn from "components/Signin";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/signin",
    element: <SignIn/>
  }
]);

export default router;