import { FC, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AdminLogin } from "../../../models/AdminLogin";
import { UserService } from "../../../services/User";

export const Login: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { adminLogin } = UserService();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const loginData: AdminLogin = { username, password };
    const loginAdmin: any = await adminLogin(loginData);

    if (loginAdmin.status === "success") {
      window.location.replace("/dashboard");
    }
    setError(loginAdmin);
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center bg-light"
    >
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg border-0 justify-content-center">
            <Card.Body>
              <h3 className="text-center mb-4 text-danger">Welcome</h3>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Login
                </Button>
                {error && (
                  <p className="mt-0 p-0 text-danger text-center">{error}</p>
                )}
              </Form>
            </Card.Body>
            <Card.Footer className="text-muted text-center">
              <small>
                Don't have an account?
                <Link
                  to="https://www.facebook.com/vegetarian2003"
                  className="text-primary ms-1"
                >
                  Contact Admin
                </Link>
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
