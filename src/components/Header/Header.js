import logo from "../../images/logo.svg";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Header({ loggedIn, link, textLink, onSignOut, email }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleButtonMenu() {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  }

  return (
    <header className={`header ${loggedIn ? "header_with-menu" : ""}`}>
      <img src={logo} alt="Логотип" className="header__logo" />
      {loggedIn ? (
        <>
          <div
            className={`header__nav header__nav_mobile ${
              isMenuOpen ? "header__nav_mobile-opened" : ""
            }`}
          >
            <p className="header__email">{email}</p>
            <button className="header__button" onClick={onSignOut}>
              {textLink}
            </button>
          </div>
          <button
            className={`header__button-menu ${
              isMenuOpen ? "header__button-menu_close" : ""
            }`}
            onClick={handleButtonMenu}
          ></button>
        </>
      ) : (
        <NavLink className="header__link" to={link}>
          {textLink}
        </NavLink>
      )}
    </header>
  );
}

export default Header;
