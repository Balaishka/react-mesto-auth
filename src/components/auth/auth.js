export const BASE_URL = "https://auth.nomoreparties.co";

export const register = (username, password, email) => {
    return fetch(`${BASE_URL}/auth/local/register`, {
        method: 'POST',
        headers: {
            'Accept': 'applications/json',
            'Content-type': 'applications/json'
        },
        body: JSON.stringify({username, password, email})
    })
    .then((res) => {
        return res.json();
    })
};

export const authorize = (identifier, password) => {
    return fetch(`${BASE_URL}/auth/local`, {
        method: 'POST',
        headers: {
            'Accept': 'applications/json',
            'Content-type': 'applications/json'
        },
        body: JSON.stringify({identifier, password})
    }
    .then((res) => {
        return res.json();
    }))
};

export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        headers: {
            'Accept': 'applications/json',
            'Content-type': 'applications/json',
            'Authorization': `Bearer ${token}`
        }
    }
    .then((res) => {
        return res.json();
    }))
};