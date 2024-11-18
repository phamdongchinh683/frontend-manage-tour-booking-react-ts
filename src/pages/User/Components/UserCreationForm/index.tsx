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
import { ProvinceResponse } from "../../../../models/ProvinceResponse";
import { RoleResponse } from "../../../../models/RoleResponse";
import { UserCreation } from "../../../../models/UserCreation";
import { RoleService } from "../../../../services/Role";
import { UserService } from "../../../../services/User";

export const UserCreationForm: FC = () => {
  const navigate = useNavigate();
  const { getRoles } = RoleService();
  const { AddUsers, provinceVietNam } = UserService();
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userList, setUserList] = useState<UserCreation[]>([]);
  const [data, setData] = useState<UserCreation>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    email: "",
    phone: "",
    role_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, provincesData] = await Promise.all([
          getRoles(),
          provinceVietNam(),
        ]);
        setRoles(rolesData);
        setProvinces(provincesData);
      } catch (err) {
        setError("Failed to load roles or provinces.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    setUserList(users);
  }, []);

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const deleteUser = (index: number) => {
    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));

    setUserList(users);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const {
      username,
      password,
      firstName,
      lastName,
      age,
      city,
      email,
      phone,
      role_id,
    } = data;
    if (
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !age ||
      !city ||
      !email ||
      !phone ||
      !role_id
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));
    setUserList(users);

    try {
      alert("User created successfully!");
      setData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        age: "",
        city: "",
        email: "",
        phone: "",
        role_id: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create user. Please try again.");
    }
  };

  const saveUsers = async () => {
    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const result: any = await AddUsers({ users: users });

    if (result === "Exited") {
      alert("Some users already exist in the system. Please review the data.");
    } else if (users.length === 0) {
      alert("No users have been created. Please add users before saving.");
    } else {
      alert("Users have been successfully saved to the database.");
      localStorage.removeItem("users");
      navigate("/dashboard/manage-user/user");
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
      <div className="users-header d-flex justify-content-between align-items-center">
        <h1>Create Users</h1>
      </div>
      <Row className="mt-2">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              Create New User
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
                  <Form.Group as={Col} controlId="formGridFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="first name"
                      name="firstName"
                      value={data.firstName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="last name"
                      name="lastName"
                      value={data.lastName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="age"
                      name="age"
                      value={data.age}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Select
                      name="city"
                      value={data.city}
                      onChange={handleChange}
                    >
                      <option value="">Select city...</option>
                      {provinces.map((province) => (
                        <option
                          key={province.province_id}
                          value={province.province_name}
                        >
                          {province.province_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3" controlId="formGridUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="username"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGridPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="phone number"
                      name="phone"
                      value={data.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Row>
                <Form.Group controlId="formGridRole" className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role_id"
                    value={data.role_id}
                    onChange={handleChange}
                  >
                    <option value="">Select role...</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
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
              Created Users
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Password</th>
                      <th>PhoneNumber</th>
                      <th>Email</th>
                      <th>Handler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) => (
                      <tr key={index}>
                        <td className="text-truncate-column">
                          {user.username}
                        </td>
                        <td className="text-truncate-column">
                          {user.password}
                        </td>
                        <td className="text-truncate-column">{user.phone}</td>
                        <td className="text-truncate-column">{user.email}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteUser(index)}
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
                  <span>Save these users to the database</span>
                  <Button variant="primary" onClick={saveUsers}>
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
