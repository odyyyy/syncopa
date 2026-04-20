import { useContext } from "solid-js";
import { AuthContext } from "../../context/auth.context";

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext не найден");
  return ctx;
};