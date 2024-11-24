import { FC, useEffect, useState } from "react";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { UserDetail } from "../../../../models/UserDetail";
import { UserService } from "../../../../services/User";

export const UserDetailById: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUserById } = UserService();
  const [user, setUser] = useState<UserDetail | null>(null);
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
        setLoading(true);
      }
    };
    fetchUser();
  }, []);

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

  console.log(user);
  if (!user) {
    return (
      <div className="text-center mt-4">
        <h2>User not found</h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/dashboard/manage-user/user")}
        >
          Back to User List
        </Button>
      </div>
    );
  } else {
    return (
      <Container className="py-5">
        <h1 className="mb-4 text-center">User Details</h1>
        <Card>
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">{`${user.fullName?.firstName} ${user.fullName?.lastName}`}</h4>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <strong>Id:</strong> {user._id}
            </div>
            <div className="mb-3">
              <strong>Username:</strong> {user.username}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {user.contact?.email}
            </div>
            <div className="mb-3">
              <strong>Phone:</strong> {user.contact?.phone}
            </div>
            <div className="mb-3">
              <strong>FirstName:</strong> {user.fullName.firstName}
            </div>
            <div className="mb-3">
              <strong>LastName:</strong> {user.fullName.lastName}
            </div>
            <div className="mb-3">
              <strong>Phone:</strong> {user.contact?.phone}
            </div>
            <div className="mb-3">
              <strong>City:</strong> {user.city}
            </div>
            <div className="mb-3">
              <strong>Age:</strong> {user.age}
            </div>
            <div className="mb-3">
              <strong>Role:</strong> {user.role_id}
            </div>
            <div className="mb-3">
              <strong>Create At:</strong> {user.createAt}
            </div>
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                className="me-2"
                onClick={() =>
                  navigate(`/dashboard/manage-user/edit-user/${id}`)
                }
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard/manage-user/user")}
              >
                Back
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
};
