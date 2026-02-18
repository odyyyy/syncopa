import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { register } from "../../api/auth.api";

export default function useRegisterForm() {
  const [formFields, setFormFields] = createStore<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = createSignal(false);

  const navigate = useNavigate();

  const handleFieldInput = (e: CustomInputEvent) => {
    const { name, value } = e.currentTarget;
    
    setFormFields(name as keyof RegisterFormData, value);
  };

  const handleRegister = async (e: SubmitEvent) => {
    e.preventDefault();
    const payload = { ...formFields }; 
    delete payload.confirmPassword;
    
    const response = await register(payload);

    if (response.type === "success") {
      toast.success("Вы успешно зарегистировались!");
      navigate("/login");
    } else if (response.type === "error") {
      toast.error(response.detail);
    }
  };

  const togglePassword = (e: MouseEvent) => {
    e.preventDefault();
    setPasswordVisibility((passwordVisibility) => !passwordVisibility);
  };

  const checkPasswordsMatch = (e: HTMLInputElement) => {
    const matchPasswordsElement = document.querySelector(
      "[data-passwords-match-validator]",
    );

    const passwordInputElements = document.querySelectorAll(".password");

    if (formFields.password === formFields.confirmPassword) {
      passwordInputElements.forEach((el) =>
        el.classList.remove("border-error"),
      );
      matchPasswordsElement?.classList.add("hidden");
    } else {
      matchPasswordsElement?.classList.remove("hidden");
      e.classList.add("border-error");
    }
  };

  return {
    handleFieldInput,
    handleRegister,
    passwordVisibility,
    togglePassword,
    checkPasswordsMatch,
  };
}
