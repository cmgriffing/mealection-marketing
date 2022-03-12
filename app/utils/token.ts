// global declare localStorage;

const TOKEN_KEY = "accessToken";

export function getToken() {
  if (window !== undefined) {
    return window.localStorage.getItem(TOKEN_KEY);
  }
}

export function setToken(token: string) {
  if (window !== undefined) {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  }
}
