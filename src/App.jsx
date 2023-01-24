//import { ThemeProvider, createTheme } from '@mui/material/styles';
//import { red } from '@mui/material/colors';
import Signup from 'components/Auth/Signup';
//import Login from 'components/Auth/Login';
import MagickLinkAuth from 'components/Auth/MagickLinkAuth';
import MagickLink from 'components/Auth/MagickLink';
import Home from 'components/Home';
import Layout from 'components/Layout';
import Editor from 'components/Editor';
import Admin from 'components/Admin';
import Missing from 'components/Missing';
import Unauthorized from 'components/Unauthorized';
import Lounge from 'components/Lounge';
import LinkPage from 'components/LinkPage';
import RequireAuth from 'components/Auth/RequireAuth';
import PersistLogin from 'components/PersistLogin';
import Dashboard from 'components/Dashboard';
//import AddBilboMDJob from 'components/AddBilboMDJob';
import BilboMDJob from 'components/BilboMDJob';
//import { SubmitJob } from 'components/SubmitJob';
//import ImageForm from 'components/UploadForm';
import { Routes, Route } from 'react-router-dom';
import VerifyUser from 'components/Auth/VerifyUser';
//import Dashboard from 'components/DashBoardExample';
import { ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
//import MUITest from 'components/Uploads/MUITest';
import NewUpload2 from 'components/Uploads/NewUpload2';

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150
};

// const useStyles = makeStyles(() =>
//   createStyles({
//     title: {
//       flexGrow: 1
//     }
//   })
// );

function App() {
  //const classes = useStyles();
  const [theme, setTheme] = useState(lightTheme);
  //const isDarkTheme = theme === darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="register" element={<Signup />} />
          <Route path="verify/:code" element={<VerifyUser />} />
          <Route path="magicklink" element={<MagickLink />} />
          <Route path="auth/:otp" element={<MagickLinkAuth />} />
          {/* <Route path="login" element={<Login />} /> */}
          <Route path="login" element={<MagickLink />} />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="job" element={<NewUpload2 />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* we want to protect these routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="/" element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
              <Route path="editor" element={<Editor />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="admin" element={<Admin />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
              <Route path="lounge" element={<Lounge />} />
            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
