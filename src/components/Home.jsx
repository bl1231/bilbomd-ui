import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        // if used in more components, this should be in context
        // axios to /logout endpoint
        setAuth({});
        navigate('/linkpage');
    };

    return (
        <section>
            <h1>BilboMD Home</h1>
            <Link to="/login">Login</Link>
            <br />
            <Link to="/dashboard">Go to the dashboard page</Link>
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
            </div>
        </section>
    );
};

export default Home;
