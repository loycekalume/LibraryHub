
import axios from "../../utils/axios";

export const logout = async () => {
  try {
    await axios.post("/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("token");  
    localStorage.removeItem("user");
    return true;
  } catch (error) {
    console.error("Logout failed", error);
    return false;
  }
};
