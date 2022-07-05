import logo from "../../images/logo.svg";
import { NavLink } from 'react-router-dom';

function Header({ loggedIn, link, textLink, onLogout }) {
  return (
    <header className="header">
      <img src={logo} alt="Логотип" className="header__logo" />
      <div className="header__nav">
        {loggedIn ? 
        <button className="header__button" onClick={onLogout}>{textLink}</button> :
        <NavLink className="header__link" to={link}>{textLink}</NavLink>}
      </div>
    </header>
  );
}

export default Header;
