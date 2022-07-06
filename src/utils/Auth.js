class Auth {
  constructor({ baseUrl, headers }) {
    this._url = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _fetch(way, methodName, bodyContent) {
    return fetch(`${this._url}${way}`, {
      method: methodName,
      headers: this._headers,
      body: JSON.stringify(bodyContent),
    }).then(this._checkResponse);
  }

  register({ password, email }) {
    return this._fetch("/signup", "POST", {
      password: password,
      email: email,
    });
  }

  authorize({ password, email }) {
    return this._fetch("/signin", "POST", {
      password: password,
      email: email,
    });
  }

  getContent = (jwt) => {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        Accept: "applications/json",
        "Content-type": "applications/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then(this._checkResponse);
  };
}

const auth = new Auth({
  baseUrl: "https://auth.nomoreparties.co",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default auth;
