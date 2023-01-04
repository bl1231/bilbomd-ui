import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function UserCard() {
  return (
    <Card style={{ width: '10rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>First Last</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

export default UserCard;