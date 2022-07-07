import check from "../../images/check.svg";
import error from "../../images/error.svg";

function InfoTooltip({ isSuccess, onClose, isOpen }) {
  return (
    <div
      className={`popup popup_name_info-tooltip ${
        isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-btn"
          aria-label="Закрыть"
          onClick={onClose}
        ></button>
        <img
          className="popup__img"
          src={isSuccess ? check : error}
          alt={isSuccess ? "Успешно" : "Ошибка"}
        />
        <h3 className="popup__message">
          {isSuccess
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."}
        </h3>
      </div>
    </div>
  );
}

export default InfoTooltip;
