import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
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

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

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
  const [userData, setUserData] = useState({
    _id: "",
    email: "",
  });
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
    tokenCheck();
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
      .then((data) => {
        setUserData({
          _id: data._id,
          email: data.email,
        });
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleLogin({ email, password }) {
    auth
      .authorize({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setUserData({
          _id: res._id,
          email: res.email,
        });
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setUserData({
      _id: "",
      email: "",
    });
    setLoggedIn(false);
  }

  function tokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .getContent(jwt)
        .then((res) => {
          setUserData({
            _id: res._id,
            email: res.email,
          });
          setLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  }

  return (
    <>
      <CurrentUserContext.Provider value={{ currentUser }}>
        <div className="page">
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              loggedIn={loggedIn}
              userData={userData}
            >
              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                userData={userData}
                handleLogout={handleLogout}
                loggedIn={loggedIn}
              />
            </ProtectedRoute>

            <Route path="/sign-up">
              <Login handleLogin={handleLogin} tokenCheck={tokenCheck} />
            </Route>

            <Route path="/sign-in">
              <Register handleRegister={handleRegister} />
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
        </div>
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
