import logo from "../../images/logo.svg";
import { NavLink } from 'react-router-dom';

function Header({ link, textLink }) {
  return (
    <header className="header">
      <img src={logo} alt="Логотип" className="header__logo" />
      <div className="header__nav">
        <NavLink className="header__link" to={link}>{textLink}</NavLink>
      </div>
    </header>
  );
}

export default Header;
