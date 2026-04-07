import {
  Component,
  createEffect,
  createSignal,
  Show,
} from "solid-js";
import useUserDataUpdate from "../../hooks/users/useUserDataUpdate";
import { userData } from "../../store/user";
import PasswordVisibilityBtn from "../utils/PasswordVisibilityBtn";
import LoadingOverlay from "../utils/Loaders/LoadingOverlay";
import AvatarPicture from "./Avatars/AvatarPicture";
import AvatarDefault from "./Avatars/AvatarDefault";

type UserSettingsProps = {
  open: boolean;
  onClose: () => void;
};

const UserAccountSettings: Component<UserSettingsProps> = (
  props: UserSettingsProps,
) => {
  const {
    openPasswordChangeFields,
    setOpenPasswordChangeFields,
    openEmailChangeFields,
    setOpenEmailChangeFields,
    avatarPreview,
    handleAvatarSelect,
    handleUserDataUpdate,
  } = useUserDataUpdate();

  let dialogRef: HTMLDialogElement | undefined;
  let fileInputRef: HTMLInputElement | undefined;
  let emailInputRef: HTMLInputElement | undefined;
  let formRef: HTMLFormElement | undefined;

  const [passwordVisibility, setPasswordVisibility] = createSignal(false);

  createEffect(() => {
    if (props.open) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const onClose = () => {
    setOpenPasswordChangeFields(false);
    setOpenEmailChangeFields(false);
    setPasswordVisibility(false);
    emailInputRef!.value = userData.email;
    props.onClose();
  };
  const [isUpdating, setIsUpdating] = createSignal(false);
  return (
    <dialog ref={dialogRef} class="modal" onClose={onClose}>
      <div class="modal-box flex items-center justify-center flex-col gap-3 bg-base-200">
        <Show when={isUpdating()}>
          <LoadingOverlay loadingMessage="Обновление данных..." />
        </Show>

        <h3 class="text-xl font-bold mb-3 ">Настройки аккаунта</h3>

        <div
          class="relative group cursor-pointer"
          onClick={() => fileInputRef?.click()}
        >
          <Show when={!avatarPreview() && !userData.avatar}>
            <AvatarDefault username={userData.username} size={25} />
          </Show>

          <Show when={!avatarPreview() && userData.avatar}>
            <AvatarPicture src={userData.avatar} username={userData.username} size={25} />
          </Show>

          <Show when={avatarPreview()}>
            <AvatarPicture src={avatarPreview()!} username={userData.username} size={25} />
          </Show>

          <div
            class="
            absolute inset-0 rounded-full
            bg-black/40 opacity-0
            group-hover:opacity-100
            flex items-center justify-center
            transition
          "
          >
            <span class="text-sm text-white font-semibold">Изменить</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/webp, image/jpg, image/gif"
            class="hidden"
            name="avatar"
            onChange={handleAvatarSelect}
          />
        </div>

        <div
          class="font-semibold text-xl text-base-content max-w-50 truncate cursor-default"
          title={userData.username}
        >
          {userData.username}
        </div>

        <form
          id="change-user-data"
          name="change-user-data"
          ref={formRef}
          onsubmit={async (e) => {
            e.preventDefault();
            setIsUpdating(true);
            await handleUserDataUpdate(formRef!);
            setIsUpdating(false);
            onClose();
          }}
        >
          <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">Email</legend>
            <fieldset class="fieldset">
              <div class="join">
                <input
                  type="text"
                  ref={emailInputRef}
                  class="input join-item validator"
                  required
                  name="email"
                  pattern="[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$"
                  placeholder="Email"
                  value={userData.email}
                  disabled={!openEmailChangeFields()}
                />

                <button
                  class="btn btn-neutral p-3 rounded-xl opacity-90 join-item ml-2"
                  onclick={(e) => {
                    e.preventDefault();
                    setOpenEmailChangeFields(!openEmailChangeFields());
                  }}
                >
                  <svg
                    fill="currentColor"
                    class="h-3 w-3"
                    viewBox="0 0 36 36"
                    version="1.1"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path
                      class="clr-i-solid clr-i-solid-path-1"
                      d="M4.22,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13,32,28.84,16.22,20,7.4Z"
                    ></path>
                    <path
                      class="clr-i-solid clr-i-solid-path-2"
                      d="M33.82,8.32l-5.9-5.9a2.07,2.07,0,0,0-2.92,0L21.72,5.7l8.83,8.83,3.28-3.28A2.07,2.07,0,0,0,33.82,8.32Z"
                    ></path>
                    <rect x="0" y="0" width="36" height="36" fill-opacity="0" />
                  </svg>
                </button>
              </div>

              <p class="validator-hint">
                Введите Email (Пример: example@mail.com)
              </p>
            </fieldset>
            <Show when={!openPasswordChangeFields()}>
              <legend class="fieldset-legend">Пароль</legend>
              <div class="join">
                <input
                  type="password"
                  value="just-your-password"
                  disabled
                  class="input join-item"
                  placeholder="Пароль"
                />
                <button
                  class="btn btn-neutral p-3 rounded-xl opacity-90 join-item ml-2"
                  onclick={(e) => {
                    e.preventDefault();
                    setOpenPasswordChangeFields(true);
                  }}
                >
                  <svg
                    fill="currentColor"
                    class="h-3 w-3"
                    viewBox="0 0 36 36"
                    version="1.1"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path
                      class="clr-i-solid clr-i-solid-path-1"
                      d="M4.22,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13,32,28.84,16.22,20,7.4Z"
                    ></path>
                    <path
                      class="clr-i-solid clr-i-solid-path-2"
                      d="M33.82,8.32l-5.9-5.9a2.07,2.07,0,0,0-2.92,0L21.72,5.7l8.83,8.83,3.28-3.28A2.07,2.07,0,0,0,33.82,8.32Z"
                    ></path>
                    <rect x="0" y="0" width="36" height="36" fill-opacity="0" />
                  </svg>
                </button>
              </div>
            </Show>
            <Show when={openPasswordChangeFields()}>
              <legend class="fieldset-legend">Старый пароль</legend>
              <div class="relative w-full">
                <input
                  type={passwordVisibility() ? "text" : "password"}
                  class="input validator peer join-item"
                  required
                  name="old_password"
                  minlength="8"
                  maxlength="64"
                  pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,64}$"
                  placeholder="Старый пароль"
                />
                <PasswordVisibilityBtn
                  passwordVisibility={passwordVisibility}
                  setPasswordVisibility={setPasswordVisibility}
                />
              </div>
              <p class="validator-hint hidden mt-2">
                Пароль должен содержать более 8 символов
                <br /> Хотя бы одну цифру
                <br /> Хотя бы одну букву в нижнем регистре
                <br /> Хотя бы одну букву в верхнем регистре
              </p>
              <legend class="fieldset-legend">Новый пароль</legend>
              <div class="relative w-full">
                <input
                  type={passwordVisibility() ? "text" : "password"}
                  class="input  validator  join-item"
                  required
                  name="password"
                  minlength="8"
                  maxlength="64"
                  pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,64}$"
                  placeholder="Новый пароль"
                />
                <PasswordVisibilityBtn
                  passwordVisibility={passwordVisibility}
                  setPasswordVisibility={setPasswordVisibility}
                />
              </div>
              <p class="validator-hint hidden mt-2">
                Пароль должен содержать более 8 символов
                <br /> Хотя бы одну цифру
                <br /> Хотя бы одну букву в нижнем регистре
                <br /> Хотя бы одну букву в верхнем регистре
              </p>
            </Show>
          </fieldset>
        </form>

        <button
          class="btn btn-neutral p-5 rounded-xl mt-4"
          type="submit"
          form="change-user-data"
        >
          Применить изменения
        </button>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button aria-label="close"></button>
      </form>
    </dialog>
  );
};

export default UserAccountSettings;
