import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";

export default function useLoginForm() {
  const [formFields, setFormFields] = createStore<LoginFormData>({
    email: "",
    password: "",
  });

  const [passwordVisibility, setPasswordVisibility] = createSignal(false);

  const handleFieldInput = (e: CustomInputEvent) => {
    const { name, value } = e.currentTarget;
    setFormFields(name as keyof LoginFormData, value);
  };

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    const navigate = useNavigate();

    const response = await login(formFields);

    if (response.type === "success") {
      toast.success("Успешный вход!");
      navigate("/app");
    } else if (response.type === "error") {
      toast.error(response.message);
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
