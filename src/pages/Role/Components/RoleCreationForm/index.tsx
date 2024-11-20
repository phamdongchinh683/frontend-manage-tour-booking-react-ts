import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RoleCreation } from "../../../../models/RoleCreation";
import { RoleResponse } from "../../../../models/RoleResponse";
import { RoleService } from "../../../../services/Role";

export const RoleCreationForm: FC = () => {
  const navigate = useNavigate();
  const { getRoles, addRole } = RoleService();
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleList, setRoleList] = useState<RoleCreation[]>([]);
  const [data, setData] = useState<RoleCreation>({
    name: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData.data);
      } catch (err) {
        setError("Failed to load roles or provinces.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const savedRoles = localStorage.getItem("roles");
    const roles = savedRoles ? JSON.parse(savedRoles) : [];
    setRoleList(roles);
  }, []);

  const handleChange = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement | HTMLSelectElement;
    setData((prevData) => ({
      ...prevData,
      name: value,
    }));
  };

  const deleteRole = (index: number) => {
    const savedRoles = localStorage.getItem("roles");
    const roles = savedRoles ? JSON.parse(savedRoles) : [];

    roles.splice(index, 1);
    localStorage.setItem("roles", JSON.stringify(roles));

    setRoleList(roles);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name } = data;
    if (!name) {
      setError("Please fill in field.");
      return;
    }
    setError(null);
    const savedRoles = localStorage.getItem("roles");
    const roles = savedRoles ? JSON.parse(savedRoles) : [];
    roles.push(data);
    localStorage.setItem("roles", JSON.stringify(roles));
    setRoleList(roles);

    try {
      alert("User created successfully!");
      setData({
        name: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create user. Please try again.");
    }
  };

  const saveRoles = async () => {
    const savedRoles = localStorage.getItem("roles");
    const roles = savedRoles ? JSON.parse(savedRoles) : [];
    const result: any = await addRole({ roles: roles });

    if (result === "Exited") {
      alert("Some roles already exist in the system. Please review the data.");
    } else if (roles.length === 0) {
      alert("No roles have been created. Please add roles before saving.");
    } else {
      alert("roles have been successfully saved to the database.");
      localStorage.removeItem("roles");
      navigate("/dashboard/manage-role/role");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  return (
    <Container>
      <div className="roles-header d-flex justify-content-between align-items-center">
        <h1>Create roles</h1>
      </div>
      <Row className="mt-2">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              Create New Role
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError(null)}
                  dismissible
                >
                  {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridLastName">
                    <Form.Label>Role Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="role"
                      name="role"
                      value={data.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Col className="d-flex justify-content-between">
                    <Button variant="primary" type="submit" className="w-48">
                      Create
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="bg-secondary text-white">
              Created roles
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>NameRole</th>
                      <th>Handler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleList.map((role, index) => (
                      <tr key={index}>
                        <td className="text-truncate-column">{role.name}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteRole(index)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Row className="mt-3">
                <Col className="d-flex justify-content-between align-items-center">
                  <span>Save these roles to the database</span>
                  <Button variant="primary" onClick={saveRoles}>
                    Save
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br />
    </Container>
  );
};
