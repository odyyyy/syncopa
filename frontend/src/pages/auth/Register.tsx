import { Component } from "solid-js";
import useRegisterForm from "../../hooks/auth/useRegisterForm";
import ThemeController from "../../components/utils/ThemeController";
import { A } from "@solidjs/router";
import PasswordVisibilityBtn from "../../components/utils/PasswordVisibilityBtn";

const Register: Component = () => {
  const {
    handleFieldInput,
    handleRegister,
    passwordVisibility,
    setPasswordVisibility,
    checkPasswordsMatch,
  } = useRegisterForm();

  return (
    <>
      <div class="flex justify-end m-5 ">
        <ThemeController />
      </div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        <form
          onsubmit={handleRegister}
          class="fieldset bg-base-200 border-base-300 rounded-2xl w-xs border p-4 flex flex-col"
        >
          <fieldset class="fieldset">
            <label class="label">Email</label>
            <input
              pattern="[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$"
              type="text"
              name="email"
              class="input validator email"
              placeholder="Email"
              required
              onInput={handleFieldInput}
            />
            <p class="validator-hint hidden">
              Введите Email (Пример: example@mail.com)
            </p>
          </fieldset>

          <span class="label">Никнейм</span>
          <input
            type="text"
            name="username"
            class="input validator"
            required
            placeholder="Никнейм"
            pattern="[A-Za-z][A-Za-z0-9\-]*"
            minlength="3"
            maxlength="30"
            title="Допустимые символы: буквы, цифры и _"
            onInput={handleFieldInput}
          />
          <p class="validator-hint hidden">
            Должен содержать от 3 до 30 символов
            <br />
            Допустимые символы: буквы, цифры и _
          </p>

          <div class="fieldset">
            <span class="label">Пароль</span>

            <div class="relative w-full ">
              <input
                type={passwordVisibility() ? "text" : "password"}
                name="password"
                class="input validator password peer w-full pr-10"
                required
                placeholder="Пароль"
                minlength="8"
                maxlength="64"
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,64}$"
                onInput={handleFieldInput}
                onBlur={(e) => checkPasswordsMatch(e.target)}
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

          <div class="fieldset">
            <span class="label">Подтвердите пароль</span>

            <div class="relative w-full">
              <input
                type={passwordVisibility() ? "text" : "password"}
                name="confirmPassword"
                class="input validator  password peer w-full pr-10"
                required
                placeholder="Подтвердите пароль"
                minlength="8"
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,64}$"
                onInput={handleFieldInput}
                onBlur={(e) => checkPasswordsMatch(e.target)}
              />

              <PasswordVisibilityBtn
                passwordVisibility={passwordVisibility}
                setPasswordVisibility={setPasswordVisibility}
              />

              <p class="hidden text-error mt-2" data-passwords-match-validator>
                Пароли должны совпадать
              </p>
            </div>
          </div>

          <button class="btn btn-neutral mt-4 rounded-xl" type="submit">
            Создать аккаунт
          </button>
          <div class="self-center mt-2">
            <span>Есть аккаунта? </span>
            <A class="text-primary" href="/login">
              Авторизоваться!
            </A>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
