import { useState } from "react";
import Header from "../Header/Header";

function Register({ handleRegister }) {
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

  function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = data;
    handleRegister({email, password});
  }

  return (
    <>
      <Header link="/sign-up" textLink="Войти" />

      <main className="content">
        <section className="content__block auth">
          <form className="form form_login auth__form" onSubmit={handleSubmit}>
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
            <button
              type="submit"
              className={`form__btn auth__btn form__btn_type_login`}
              aria-label="Регистрация"
            >
              Зарегистрироваться
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Register;
