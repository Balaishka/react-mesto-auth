import logo from "../../images/logo.svg";

function Header({ loggedIn, children }) {
  return (
    <header className={`header ${loggedIn ? "header_with-menu" : ""}`}>
      <img src={logo} alt="Логотип" className="header__logo" />
      {children}
    </header>
  );
}

export default Header;
