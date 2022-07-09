import logo from "../../images/logo.svg";
import { Switch, Route, NavLink } from "react-router-dom";
import { useState } from "react";

function Header({ loggedIn, email, handleLogout }) {
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

      <Switch>
        <Route exact path="/">
          <>
            <div
              className={`header__nav header__nav_mobile ${
                isMenuOpen ? "header__nav_mobile-opened" : ""
              }`}
            >
              <p className="header__email">{email}</p>
              <button className="header__button" onClick={handleLogout}>
                Выйти
              </button>
            </div>
            <button
              className={`header__button-menu ${
                isMenuOpen ? "header__button-menu_close" : ""
              }`}
              onClick={handleButtonMenu}
            ></button>
          </>
        </Route>

        <Route path="/sign-up">
          <NavLink className="header__link" to="/sign-in">
            Регистрация
          </NavLink>
        </Route>

        <Route path="/sign-in">
          <NavLink className="header__link" to="/sign-up">
            Войти
          </NavLink>
        </Route>
      </Switch>
    </header>
  );
}

export default Header;
