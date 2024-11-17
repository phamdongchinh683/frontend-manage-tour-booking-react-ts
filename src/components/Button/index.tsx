import Button from 'react-bootstrap/Button';

interface ButtonPageProps {
  color: string;
  text: string;
  fun: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ButtonPage: React.FC<ButtonPageProps> = ({ color, text, fun }) => {
  return (
    <Button variant={color} onClick={fun}>
      {text}
    </Button>
  );
};

export default ButtonPage;
