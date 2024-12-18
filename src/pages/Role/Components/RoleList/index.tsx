import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ButtonPage from "../../../../components/Button";
import TableList from "../../../../components/TableList";
import { ApiResponse } from "../../../../models/ApiResponse";
import { RoleListResponse } from "../../../../models/RoleListResponse";
import { RoleService } from "../../../../services/Role";

export const RoleList: FC = () => {
  const { getRoles, deleteRoleById, deleteRoles } = RoleService();
  const [list, setList] = useState<RoleListResponse[]>([]);
  const [checkedRole, setCheckedRole] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectAll, setSelectAll] = useState(false);
  const apiCall = useRef(true);

  const fetchRoles = async () => {
    try {
      const roles: ApiResponse<RoleListResponse[]> = await getRoles();
      setList(roles.data);
      setCheckedRole(checkedRole);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };
  useEffect(() => {
    if (apiCall.current) {
      apiCall.current = false;
      fetchRoles();
    }
  }, []);

  const updateCheckedState = (updatedState: { [key: string]: boolean }) => {
    setCheckedRole(updatedState);
    setSelectAll(Object.values(updatedState).every(Boolean));
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    roleId: string
  ) => {
    updateCheckedState({ ...checkedRole, [roleId]: e.target.checked });
  };

  const handleSelectAllChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const updatedState = Object.fromEntries(
      list.map((role) => [role._id, isChecked])
    );
    updateCheckedState(updatedState);
  };

  const getSelectedRoles = () => {
    return Object.keys(checkedRole).filter((roleId) => checkedRole[roleId]);
  };

  const deleteById = async (roleId: string) => {
    if (!window.confirm("Are you sure you want to delete this Role?")) {
      return;
    }
    try {
      await deleteRoleById(roleId);
      setList((prevList) => prevList.filter((role) => role._id !== roleId));
    } catch (error) {
      console.error("Failed to delete the Role:", error);
    }
  };

  const deleteSelectedRoles = async () => {
    const selectedIds = getSelectedRoles();
    if (selectedIds.length === 0) {
      alert("Please select roles to delete.");
      return;
    }

    if (
      !window.confirm("Are you sure you want to delete the selected roles?")
    ) {
      return;
    }

    try {
      const ids = selectedIds.map((id: any) => {
        return { _id: id };
      });
      await deleteRoles(ids);
      setList((prevList) =>
        prevList.filter((role) => !selectedIds.includes(role._id))
      );
    } catch (error) {
      console.error("Failed to delete selected roles:", error);
    }
  };

  const tableData = list.map((role) => (
    <tr key={role._id} className="align-middle text-center">
      <td>
        <input
          type="checkbox"
          checked={checkedRole[role._id] || false}
          onChange={(e) => handleCheckboxChange(e, role._id)}
        />
      </td>
      <td>{role.name}</td>
      <td className="d-flex gap-1 justify-content-center align-items-center">
        <ButtonPage
          color="danger"
          text="Delete"
          fun={() => deleteById(role._id)}
        />
      </td>
    </tr>
  ));

  return (
    <TableList
      title="Roles"
      create={
        <Link to="/dashboard/manage-role/create-role">
          <Button variant="success">Create</Button>
        </Link>
      }
      deletes={
        <Button variant="danger" onClick={deleteSelectedRoles}>
          Delete roles
        </Button>
      }
      data={
        list.length === 0 ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" variant="primary" />
            <span>There are currently no roles available</span>
          </div>
        ) : (
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
                <th>Role Name</th>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>{tableData}</tbody>
          </Table>
        )
      }
      page={null}
    />
  );
};
