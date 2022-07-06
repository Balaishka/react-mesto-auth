function InfoTooltip({ name, isOpen, onClose, message, linkImg }) {
  return (
    <div className={`popup popup_name_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          type="button"
          className={`popup__close-btn popup__close-btn_name_${name}`}
          aria-label="Закрыть"
          onClick={onClose}
        ></button>
        <img className="popup__img" src={linkImg} alt={message} />
        <h3 className="popup__message">{message}</h3>
      </div>
    </div>
  );
}

export default InfoTooltip;
