import { Component } from "solid-js";
import useLoginForm from "../../hooks/auth/useLoginForm";
import ThemeController from "../../components/utils/ThemeController";
import { A } from "@solidjs/router";
import PasswordVisibilityBtn from "../../components/utils/PasswordVisibilityBtn";

const Login: Component = () => {
  const {
    handleFieldInput,
    handleLogin,
    passwordVisibility,
    setPasswordVisibility,
  } = useLoginForm();

  return (
    <>
      <div class="flex justify-end m-5 ">
        <ThemeController />
      </div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        <form
          onsubmit={handleLogin}
          class="fieldset bg-base-200 border-base-300 rounded-2xl w-xs border p-4 flex flex-col "
        >
          <fieldset class="fieldset">
            <label class="label">Email</label>
            <input
              type="email"
              name="email"
              class="input validator"
              placeholder="Email"
              required
              onInput={handleFieldInput}
            />
            <p class="validator-hint hidden">
              Введите ваш Email (Пример: example@mail.com)
            </p>
          </fieldset>

          <div class="fieldset">
            <span class="label">Пароль</span>

            <div class="relative w-full">
              <input
                type={passwordVisibility() ? "text" : "password"}
                class="input validator peer w-full pr-10"
                required
                name="password"
                placeholder="Пароль"
                minlength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                onInput={handleFieldInput}
              />

              <PasswordVisibilityBtn
                passwordVisibility={passwordVisibility}
                setPasswordVisibility={setPasswordVisibility}
              />

              <p class="validator-hint hidden mt-2">
                Пароль должен содержать более 8 символов
                <br /> Хотя бы одну цифру
                <br /> Хотя бы одну букву в нижнем регистре
                <br /> Хотя бы одну букву в верхнем регистре
              </p>
            </div>
          </div>

          <button class="btn btn-neutral mt-5 rounded-xl" type="submit">
            Войти в аккаунт
          </button>
          <div class="self-center mt-2">
            <span>Нет аккаунта? </span>
            <A class="text-primary" href="/register">
              Зарегистрируйтесь!
            </A>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
