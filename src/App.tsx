import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootswatch/dist/flatly/bootstrap.min.css';
import 'App.css';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/Home';
// import Header from 'components/Header';
function App() {
  return (
    <div className="App">
      <Container fluid="md">
        <RouterProvider router={router} />
      </Container>
    </div>
  );
}

export default App;
