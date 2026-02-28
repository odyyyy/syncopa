import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";

type Props = User & {
  open: boolean;
  onClose: () => void;
};

const UserAccountSettings: Component<Props> = (props: Props) => {
  const [openPasswordChangeFields, setOpenPasswordChangeFields] =
    createSignal(false);

  let dialogRef: HTMLDialogElement | undefined;

  createEffect(() => {
    if (props.open) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });
  const [avatarPreview, setAvatarPreview] = createSignal<string | null>(null);
  const [avatarFile, setAvatarFile] = createSignal<File | null>(null);

 // const { updateUserData } = useAccountManager();

  let fileInputRef: HTMLInputElement | undefined;

  const handleAvatarSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile()) return;

    try {

      const formData = new FormData();
      formData.append("avatar", avatarFile()!);

      const res = await fetch("/api/user/avatar", {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Upload failed");

      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  return (
    <dialog
      ref={dialogRef}
      class="modal"
      onClose={() => {
        setOpenPasswordChangeFields(false);
        props.onClose(); 
      }}
    >
      <div class="modal-box flex items-center justify-center flex-col gap-3 bg-base-200">
        <h3 class="text-xl font-bold mb-3 ">Настройки аккаунта</h3>

        <div
          class="relative group cursor-pointer"
          onClick={() => fileInputRef?.click()}
        >
          <Show when={!avatarPreview() && !props.avatar}>
            <div class="avatar avatar-placeholder">
              <div class="bg-neutral text-neutral-content w-25 text-4xl rounded-full">
                <span>{props.username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </Show>

          <Show when={!avatarPreview() && props.avatar}>
            <div class="avatar">
              <div class="w-25 rounded-full">
                <img src={props.avatar} />
              </div>
            </div>
          </Show>

          <Show when={avatarPreview()}>
            <div class="avatar">
              <div class="w-25 rounded-full">
                <img src={avatarPreview()!} />
              </div>
            </div>
          </Show>

          {/* hover overlay */}
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
            accept="image/*"
            class="hidden"
            onChange={handleAvatarSelect}
          />
        </div>

        <div
          class="font-semibold text-xl text-base-content max-w-[200px] truncate cursor-default"
          title={props.username}
        >
          {props.username}
        </div>

        <form id="change-user-data" name="change-user-data">
          <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">Email</legend>
            <div class="join">
              <input
                type="text"
                class="input join-item"
                required
                placeholder="Email"
                value={props.email}
              />
            </div>
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
              <input
                type="password"
                class="input validator peer join-item"
                required
                minlength="8"
                maxlength="64"
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,64}$"
                placeholder="Старый пароль"
              />
              <p class="validator-hint hidden mt-2">
                Пароль должен содержать более 8 символов
                <br /> Хотя бы одну цифру
                <br /> Хотя бы одну букву в нижнем регистре
                <br /> Хотя бы одну букву в верхнем регистре
              </p>
              <legend class="fieldset-legend">Новый пароль</legend>
              <input
                type="password"
                class="input  validator  join-item"
                required
                minlength="8"
                maxlength="64"
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,64}$"
                placeholder="Новый пароль"
              />
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

      <form
        method="dialog"
        class="modal-backdrop"
      >
        <button aria-label="close"></button>
      </form>
    </dialog>
  );
};

export default UserAccountSettings;
