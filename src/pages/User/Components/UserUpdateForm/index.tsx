import { FC, useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { UserUpdate } from "../../../../models/UserUpdate";
import { UserService } from "../../../../services/User";

export const UserUpdateForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUserById, updateUser } = UserService();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        return;
      }
      try {
        const userData = await getUserById(id);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setLoading(true);
      }
    };
    fetchUser();
  }, []);

  const saveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !user) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const updatedData: UserUpdate = {
      id: user.id,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      username: formData.get("username") as string,
      age: formData.get("age") as string,
      city: formData.get("city") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role_id: formData.get("role_id") as string,
      password: user.password,
    };

    try {
      await updateUser(updatedData);
      navigate("/dashboard/manage-user");
    } catch (error) {
      alert("Failed to update user.");
    }
  };

  if (!loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Container>
        <h2>User not found</h2>
        <Button
          onClick={() => navigate("/dashboard/manage-user/user")}
          variant="secondary"
        >
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Update User</h1>
      <Form onSubmit={saveUser}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            placeholder="Enter first name"
            defaultValue={user.fullName.firstName}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            placeholder="Enter last name"
            defaultValue={user.fullName.lastName}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter username"
            defaultValue={user.username}
            required
            disabled={true}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            name="age"
            placeholder="Enter age"
            defaultValue={user.age}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            placeholder="Enter city"
            defaultValue={user.city}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            defaultValue={user.contact.email}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            placeholder="Enter phone number"
            defaultValue={user.contact.phone}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Role ID</Form.Label>
          <Form.Control
            type="text"
            name="role_id"
            placeholder="Enter role ID"
            defaultValue={user.role_id}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate("/dashboard/manage-user/user")}
        >
          Cancel
        </Button>
      </Form>
      <br />
    </Container>
  );
};
