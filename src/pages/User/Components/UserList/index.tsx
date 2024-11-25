import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ButtonPage from "../../../../components/Button";
import { UsersResponse } from "../../../../models/UsersReponse";
import { UserService } from "../../../../services/User";

export const UserList: FC = () => {
  const { getUsers, deleteUsers } = UserService();
  const [list, setList] = useState<UsersResponse[]>([]);
  const [checkedUsers, setCheckedUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();
  const apiCall = useRef(true);

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      setList(users);
      const initialCheckedState = Object.fromEntries(
        users.map((user: any) => [user._id, false])
      );
      setCheckedUsers(initialCheckedState);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    if (apiCall.current) {
      apiCall.current = false;
      fetchUsers();
    }
  }, []);

  const updateCheckedState = (updatedState: { [key: string]: boolean }) => {
    setCheckedUsers(updatedState);
    setSelectAll(Object.values(updatedState).every(Boolean));
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    userId: string
  ) => {
    updateCheckedState({ ...checkedUsers, [userId]: e.target.checked });
  };

  const handleSelectAllChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const updatedState = Object.fromEntries(
      list.map((user) => [user._id, isChecked])
    );
    updateCheckedState(updatedState);
  };

  const getSelectedUsers = () => {
    return Object.keys(checkedUsers).filter((userId) => checkedUsers[userId]);
  };

  const deleteUserById = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUsers([{ _id: userId }]);
      setList((prevList) => prevList.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const editUser = (index: string) => {
    navigate(`/dashboard/manage-user/edit-user/${index}`, { state: { index } });
  };

  const deleteUserByIds = async () => {
    const selectedIds = getSelectedUsers();
    if (selectedIds.length === 0) {
      alert("Please select users to delete.");
      return;
    }

    if (
      !window.confirm("Are you sure you want to delete the selected users?")
    ) {
      return;
    }

    try {
      await deleteUsers(selectedIds.map((id) => ({ _id: id })));
      alert("Selected users deleted successfully!");
    } catch (error) {
      console.error("Failed to delete users:", error);
      alert("Unable to delete selected users. Please try again.");
    }
  };

  if (list.length === 0) {
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
        <h1>Users</h1>
        <div className="d-flex gap-2">
          <Link to="/dashboard/manage-user/create-user">
            <Button variant="success">Create</Button>
          </Link>
          <Button variant="danger" onClick={deleteUserByIds}>
            Delete Users
          </Button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
            </th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Age</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Features</th>
          </tr>
        </thead>
        <tbody>

          
          {list.map((user) => (
            <tr key={user._id} className="align-middle text-center">
              <td>
                <input
                  type="checkbox"
                  checked={checkedUsers[user._id] || false}
                  onChange={(e) => handleCheckboxChange(e, user._id)}
                />
              </td>
              <td>{user.fullName?.firstName}</td>
              <td>{user.fullName?.lastName}</td>
              <td>{user.username}</td>
              <td>{user.age}</td>
              <td>{user.contact?.email}</td>
              <td>{user.contact?.phone}</td>
              <td className="d-flex gap-1 justify-content-center align-items-center">
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() =>
                    navigate(`/dashboard/manage-user/detail-user/${user._id}`)
                  }
                >
                  Detail
                </Button>
                <ButtonPage
                  color="primary"
                  text="Edit"
                  fun={() => editUser(user._id)}
                />
                <ButtonPage
                  color="danger"
                  text="Delete"
                  fun={() => deleteUserById(user._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
