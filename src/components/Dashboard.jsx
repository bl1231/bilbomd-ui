import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import Header from './Header';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SideBar from './SideBar';
//import UserContent from "./UserContent";
import Footer from './Footer';
const Dashboard = ({ user }) => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <Container>
            <Row>
                <Header />
            </Row>

            <Row>
                <Col md={4}>
                    <SideBar />
                </Col>

                <Col md={8}>
                    <p>CONTENT</p>
                </Col>
            </Row>

            <Row>
                <Footer />
            </Row>
        </Container>
    );
};

export default Dashboard;
