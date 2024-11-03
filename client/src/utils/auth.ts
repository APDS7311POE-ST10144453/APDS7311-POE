import {jwtDecode} from "jwt-decode"

interface DecodedToken {
  exp: number;
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  if (!(token != null && token.length > 0)) {
    return false;
  }

  try{
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return false;
    }

    return true;
  } catch(error){
    return false;
  }
}
