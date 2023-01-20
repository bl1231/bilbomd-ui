import { useNavigate, Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import useLogout from 'hooks/useLogout';
import AddBilboMDJob from './AddBilboMDJob';
import Header from './Header';

const Dashboard = (props) => {
    console.log(props);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();
    const signOut = async () => {
        await logout();
        navigate('/linkpage');
    };
    return (
        <>
            <Header />
            <h1>Dashboard {props.user}</h1>
            <br />
            <p>You must have been assigned an User role.</p>
            <div>
                <Link to="/">Home</Link>
            </div>
            <div>
                <AddBilboMDJob />
            </div>
            <button type="button" className="btn btn-primary" onClick={signOut}>
                Sign Out
            </button>
        </>
    );
};

export default Dashboard;
