import { FC } from "react";
import { NavDropdown } from "react-bootstrap";

interface LogOutProps {
  func: () => void;
}

const LogOut: FC<LogOutProps> = ({ func }) => {
  return (
    <NavDropdown title="Account" id="account-nav-dropdown">
      <NavDropdown.Item onClick={func}>Log out</NavDropdown.Item>
    </NavDropdown>
  );
};

export default LogOut;
