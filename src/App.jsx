import { ThemeProvider, createTheme } from '@mui/material/styles';
import Signup from 'components/Auth/Signup';
import MagickLinkAuth from 'components/Auth/MagickLinkAuth';
import MagickLink from 'components/Auth/MagickLink';
import Home from 'components/Home';
import Layout from 'components/Layout';
import Editor from 'components/Editor';
import Admin from 'components/Admin';
import Missing from 'components/Missing';
import Unauthorized from 'components/Unauthorized';
import Lounge from 'components/Lounge';
import RequireAuth from 'components/Auth/RequireAuth';
import PersistLogin from 'components/PersistLogin';
import Dashboard from 'components/Dashboard';
import { Routes, Route } from 'react-router-dom';
import VerifyUser from 'components/Auth/VerifyUser';

//import { darkTheme, lightTheme } from './theme';
//import { useState } from 'react';
//import { styled } from '@mui/material/styles';

//import MUITest from 'components/Uploads/MUITest';
import UploadBilboMDJob from 'components/Uploads/NewBilboMDJob';
import { purple } from '@mui/material/colors';
import JobTable from 'components/JobTable';

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150
};

const theme = createTheme({
  palette: {
    primary: {
      main: purple[300]
    },
    secondary: {
      main: '#7d6d99'
    }
  },
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700
  },
  date: {
    flexGrow: 1
  }
});

function App() {
  //const classes = useStyles();
  //const [theme, setTheme] = useState(lightTheme);
  //const isDarkTheme = theme === darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* PUBLIC & UNAUTHENTICATED ROUTES */}
        <Route path="register" element={<Signup />} />
        <Route path="verify/:code" element={<VerifyUser />} />
        <Route path="magicklink" element={<MagickLink />} />
        <Route path="auth/:otp" element={<MagickLinkAuth />} />
        <Route path="login" element={<MagickLink />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* EVERYTHING BELOW HERE WILL HAVE OUR LAYOUT*/}
        <Route path="/" element={<Layout />}>
          {/*testing area*/}
          <Route path="job" element={<UploadBilboMDJob />} />
          <Route path="dashboard" element={<JobTable />} />

          {/* PROTECTED ROUTES BELOW */}
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

            <Route
              element={
                <RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />
              }
            >
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
