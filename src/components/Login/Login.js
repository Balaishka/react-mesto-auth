import { useState } from "react";

function Login({ onLogin }) {
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

  function handleLogin(e) {
    e.preventDefault();
    onLogin(data);
  }

  return (
    <section className="content__block auth">
      <form className="form form_login auth__form" onSubmit={handleLogin}>
        <div>
          <h1 className="auth__title">Вход</h1>
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
        <button
          type="submit"
          className={`form__btn auth__btn form__btn_type_login`}
          aria-label="Войти"
        >
          Войти
        </button>
      </form>
    </section>
  );
}

export default Login;
