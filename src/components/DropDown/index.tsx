import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

const DropDown = ({ data }: { data: Array<{ linkRouter: string, name: string }> }) => {
  return (
      <Dropdown.Menu>
        Features
      {data.map((router, index) => (
          <Link to={`/dashboard/${router.linkRouter}`} key={index}>
            <div>{router.name}</div>
          </Link>
        ))}
      </Dropdown.Menu>
  );
};
export default DropDown;
