import jwtDecode from 'jwt-decode';
export default function authHeader() {
  const id = parseInt(localStorage.getItem('id'), 10);
  const jwt = localStorage.getItem('jwt');
  const token = jwtDecode(jwt);
  function checkToken(id, token) {
    if (id === token.user.id && Date.now() < token.exp * 1000) {
      return true;
    } else {
      return false;
    }
  }
  if (id && token && checkToken(id, token)) {
    return { 'Content-Type': 'application/json', 'x-auth-token': jwt };
  } else {
    return undefined;
  }
}
