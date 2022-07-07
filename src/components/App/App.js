import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory, NavLink } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "../Main/Main";
import ImagePopup from "../ImagePopup/ImagePopup";
import EditProfilePopup from "../EditProfilePopup/EditProfilePopup";
import EditAvatarPopup from "../EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "../AddPlacePopup/AddPlacePopup";
import api from "../../utils/Api";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import DeleteCardPopup from "../DeleteCardPopup/DeleteCardPopup";
import Login from "../Login/Login";
import Register from "../Register/Register";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import auth from "../../utils/Auth";
import InfoTooltip from "../InfoTooltip/InfoTooltip";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});

  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    avatar: "",
    _id: "",
  });

  const [cards, setCards] = useState([]);
  const [cardIdForDelete, setCardIdForDelete] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const history = useHistory();

  // Получаем все карточки
  useEffect(() => {
    api
      .getAllCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.status}`);
      });
  }, []);

  // Получаем всю информацию о пользователе
  useEffect(() => {
    api
      .getAllUserInfo()
      .then((data) => {
        return setCurrentUser({
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          _id: data._id,
        });
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.status}`);
      });
  }, []);

  useEffect(() => {
    if (loggedIn) {
      history.push("/");
    }
  }, [loggedIn, history]);

  useEffect(() => {
    checkToken();
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  }

  // Обновляем информацию о пользователе
  function handleUpdateUser(newUserInfo) {
    setIsLoading(true);

    api
      .setUserInfo(newUserInfo)
      .then((data) => {
        setCurrentUser(data);
        return closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.status}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Обновляем аватар
  function handleUpdateAvatar(newAvatar) {
    setIsLoading(true);

    api
      .setUserAvatar(newAvatar)
      .then((data) => {
        setCurrentUser(data);
        return closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.status}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Ставим или удаляем лайк карточке
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.status}`);
      });
  }

  // Открываем попап удаления своей карточки
  function handleCardDelete(cardId) {
    setIsDeleteCardPopupOpen(true);
    setCardIdForDelete(cardId);
  }

  // Удаляем свою карточку
  function handleDeleteCard(cardId) {
    setIsLoading(true);

    api
      .deleteCard(cardId)
      .then(() => {
        setCards(cards.filter((card) => card._id !== cardId));
        return closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.status}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Добавляем новую карточку
  function handleAddPlaceSubmit(newCard) {
    setIsLoading(true);

    api
      .addNewCard(newCard)
      .then((card) => {
        setCards([card, ...cards]);
        return closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err.status}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleRegister({ email, password }) {
    auth
      .register({ email, password })
      .then(() => {
        setIsSuccess(true);
        setIsInfoTooltipOpen(true);
        history.push("/sign-up");
      })
      .catch((err) => {
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleLogin({ email, password }) {
    auth
      .authorize({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);

        auth.getContent(res.token).then((res) => {
          setEmail(res.data.email);
        });
      })
      .catch((err) => {
        setIsSuccess(false);
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setEmail("");
    setLoggedIn(false);
  }

  function checkToken() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .getContent(jwt)
        .then((res) => {
          setEmail(res.data.email);
          setLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  }

  function handleButtonMenu() {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  }

  return (
    <>
      <CurrentUserContext.Provider value={{ currentUser }}>
        <div className="page">
          <Header loggedIn={loggedIn}>
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
          </Header>

          <main className="content">
            <Switch>
              <ProtectedRoute exact path="/" loggedIn={loggedIn}>
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  email={email}
                  onSignOut={handleLogout}
                  loggedIn={loggedIn}
                />
              </ProtectedRoute>

              <Route path="/sign-up">
                <Login onLogin={handleLogin} />
              </Route>

              <Route path="/sign-in">
                <Register onRegister={handleRegister} />
              </Route>
            </Switch>
          </main>

          <Switch>
            <Route exact path="/">
              <Footer />
            </Route>
          </Switch>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />

          <DeleteCardPopup
            isOpen={isDeleteCardPopupOpen}
            onClose={closeAllPopups}
            onDeleteCard={handleDeleteCard}
            isLoading={isLoading}
            cardId={cardIdForDelete}
          />

          <ImagePopup
            card={selectedCard}
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
          />

          <InfoTooltip
            isSuccess={isSuccess}
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
          />
        </div>
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
