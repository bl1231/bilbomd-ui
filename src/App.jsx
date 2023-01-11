import Account from 'components/Auth/Account';
//import Register from 'components/Auth/Register';
import Login from 'components/Auth/Login';
import Home from 'components/Home';
import Layout from 'components/Layout';
import Editor from 'components/Editor';
import Admin from 'components/Admin';
import Missing from 'components/Missing';
import Unauthorized from 'components/Unauthorized';
import Lounge from 'components/Lounge';
import LinkPage from 'components/LinkPage';
import RequireAuth from 'components/Auth/RequireAuth';
import Dashboard from 'components/Dashboard';
import { Routes, Route } from 'react-router-dom';
import VerifyUser from 'components/Auth/VerifyUser';

const ROLES = {
    User: 2001,
    Editor: 1984,
    Admin: 5150
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route exact path="/" element={<Home />} />
                <Route path="account" element={<Account />} />
                <Route path="register" element={<Account />} />
                <Route path="verify/:code" element={<VerifyUser />} />

                <Route path="login" element={<Account />} />
                {/* <Route path="signin" element={<SignIn />} /> */}
                <Route path="linkpage" element={<LinkPage />} />
                <Route path="unauthorized" element={<Unauthorized />} />

                {/* we want to protect these routes */}

                <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
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

                {/* catch all */}
                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    );
}

export default App;
