import { Component, createSignal, Show } from "solid-js";
import useRegisterForm from "../../hooks/auth/useRegisterForm";

const Register: Component = () => {
  const {
    handleFieldInput,
    handleRegister,
    passwordVisibility,
    togglePassword,
    checkPasswordsMatch
  } = useRegisterForm();

  return (
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
      <form
        onsubmit={handleRegister}
        class="fieldset bg-base-200 border-base-300 rounded-2xl w-xs border p-4">
        <fieldset class="fieldset">
          <label class="label">Email</label>
          <input
            type="email"
            name="email"
            class="input validator"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              onInput={handleFieldInput}
              onBlur={(e) => checkPasswordsMatch(e.target)}
            />

            <button
              type="button"
              onClick={togglePassword}
              class="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none hover:cursor-pointer"
            >
              <Show when={passwordVisibility()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </Show>
              <Show when={!passwordVisibility()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Show>
            </button>

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
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              onInput={handleFieldInput}
              onBlur={(e) => checkPasswordsMatch(e.target)}
            />

            <button
              type="button"
              onClick={togglePassword}
              class="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none hover:cursor-pointer"
            >
              <Show when={passwordVisibility()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </Show>
              <Show when={!passwordVisibility()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Show>
            </button>

            <p class="hidden text-error mt-2" data-passwords-match-validator>
              Пароли должны совпадать
            </p>
          </div>
        </div>

        <button class="btn btn-primary mt-4 rounded-xl" type="submit">
          Создать аккаунт
        </button>
      </form>
    </div>
  );
};

export default Register;
