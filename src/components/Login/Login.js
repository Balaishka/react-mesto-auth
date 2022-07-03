import { useState } from "react";
import Header from "../Header/Header";

function Login({handleLogin}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }
    
    function handleChangePassword(e) {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!email || !password) {
            return;
        } 
        handleLogin(email, password);
    }

    return (
        <>
        <Header link="/sign-in" textLink="Регистрация" />
      
        <main className="content">
            <section className="content__block auth">
                <form className="form form_login auth__form" onSubmit={handleSubmit}>
                    <h1 className="auth__title">Вход</h1>
                    <input className="auth__input" type="text" placeholder="Email" onChange={handleChangeEmail} value={email} />
                    <input className="auth__input" type="password" placeholder="Пароль" onChange={handleChangePassword} value={password} />
                    <button
                        type="submit"
                        className={`form__btn auth__btn form__btn_type_login`}
                        aria-label="Войти"
                    >Войти</button>
                </form>
            </section>
        </main>
        </>
        
    );
}

export default Login;