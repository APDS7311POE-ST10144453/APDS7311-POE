import {jwtDecode} from "jwt-decode"

/**
 * Interface representing a decoded JWT token.
 * 
 * @property {number} exp - The expiration time of the token as a Unix timestamp.
 */
interface DecodedToken {
  exp: number;
}

/**
 * Checks if the user is authenticated by verifying the presence and validity of a JWT token in local storage.
 *
 * @returns {boolean} - Returns `true` if the token exists, is valid, and has not expired; otherwise, returns `false`.
 */
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
