import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { login } from "../../api/auth.api";
import { setAccessToken } from "../../store/auth";
import { setupUserData } from "../../context/auth";

export default function useLoginForm() {
  const [formFields, setFormFields] = createStore<LoginFormData>({
    email: "",
    password: "",
  });

  const [passwordVisibility, setPasswordVisibility] = createSignal(false);

  const navigate = useNavigate();

  const handleFieldInput = (e: CustomInputEvent) => {
    const { name, value } = e.currentTarget;
    setFormFields(name as keyof LoginFormData, value);
  };

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    const response = await login(formFields);

    if (response.type === "success") {
      setAccessToken(response.data.access_token);
      await setupUserData();
      toast.success("Успешный вход!");
      navigate("/app");
    } else if (response.type === "error") {
      toast.error(response.detail);
    }
  };

  const togglePassword = (e: MouseEvent) => {
    e.preventDefault();
    setPasswordVisibility((passwordVisibility) => !passwordVisibility);
  };

  return {
    handleFieldInput,
    handleLogin,
    passwordVisibility,
    togglePassword,
  };
}
