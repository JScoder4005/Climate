import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div>
        <Link to={'/'}></Link>
      </div>
    </header>
  );
};

export default Header;
