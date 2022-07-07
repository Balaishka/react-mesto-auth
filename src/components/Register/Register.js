import { useState } from "react";
import { NavLink } from "react-router-dom";

function Register({ onRegister }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  function handleRegister(e) {
    e.preventDefault();
    onRegister(data);
  }

  return (
    <section className="content__block auth">
      <form className="form form_login auth__form" onSubmit={handleRegister}>
        <div>
          <h1 className="auth__title">Регистрация</h1>
          <input
            name="email"
            className="auth__input"
            type="text"
            placeholder="Email"
            onChange={handleChange}
            value={data.email}
          />
          <input
            name="password"
            className="auth__input"
            type="password"
            placeholder="Пароль"
            onChange={handleChange}
            value={data.password}
          />
        </div>
        <div>
          <button
            type="submit"
            className={`form__btn auth__btn form__btn_type_login`}
            aria-label="Регистрация"
          >
            Зарегистрироваться
          </button>
          <NavLink className="auth__link" to="/sign-up">
            Уже зарегистрированы? Войти
          </NavLink>
        </div>
      </form>
    </section>
  );
}

export default Register;
