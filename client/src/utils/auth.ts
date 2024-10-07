import {jwtDecode} from "jwt-decode"

interface DecodedToken {
  exp: number;
}

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) {
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
    console.log(error);
    return false;
  }
}
