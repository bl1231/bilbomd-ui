import { Link } from 'react-router-dom';

const Dashboard = (props) => {
    console.log(props);
    return (
        <section>
            <h1>Dashboard {props.user}</h1>
            <br />
            <p>You must have been assigned an User role.</p>
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    );
};

export default Dashboard;
