// import { Container } from 'react-bootstrap';
//import Button from 'react-bootstrap/Button';
//import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
function SignIn() {
  return (
    <Container>
      <Row>
      <Col/>
      <Col>
      <Form>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Enter your email address to sign in to BilboMD</Form.Label>
          <Form.Control type="email" placeholder="Email address" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Continue
        </Button>
        <Button variant="secondary" type="submit">
          Create an Account
        </Button>
      </Form>
      </Col>
      <Col/>
      </Row>
  </Container>
  )
}

export default SignIn;
