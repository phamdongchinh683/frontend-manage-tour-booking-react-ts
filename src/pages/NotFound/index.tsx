import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light text-center"
    >
      <Row>
        <Col>
          <h1 className="display-1 text-danger">404</h1>
          <h2 className="mb-3">Oops! Page Not Found</h2>
          <p className="mb-4 text-muted">
            Sorry, the page you’re looking for doesn’t exist or has been moved.
          </p>
          <Link to={"/dashboard"}>
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
