import { createSignal } from "solid-js";
import { useUserDataManagementApi } from "../../api/user.api";
import toast from "solid-toast";
import { setUserData } from "../../store/user";

export default function useUserDataUpdate() {
  const [openPasswordChangeFields, setOpenPasswordChangeFields] =
    createSignal(false);
  const [openEmailChangeFields, setOpenEmailChangeFields] = createSignal(false);
  const [avatarPreview, setAvatarPreview] = createSignal<string | null>(null);
  const [avatarFile, setAvatarFile] = createSignal<File | null>(null);

  const handleAvatarSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const { updateUserData } = useUserDataManagementApi();
  const handleUserDataUpdate = async (formRef: HTMLFormElement) => {
    const formData = new FormData(formRef);
    if (avatarFile()) {
      formData.append("avatar", avatarFile()!);
    }
    if ([...formData!.values()].every((v) => v == null || v == "")) {
      return;
    }

    const response = await updateUserData(formData);
    if (response.type === "success") {
      Object.entries(response.data).forEach(([key, value]) => {
        setUserData(key as keyof User, value);
      });
      toast.success("Данные успешно обновлены");
    } else {
      if (response.detail) {
        toast.error(response.detail);
      } else {
        toast.error("Ошибка при обновлении данных. Повторите попытку.");
      }
    }
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return {
    openPasswordChangeFields,
    setOpenPasswordChangeFields,
    openEmailChangeFields,
    setOpenEmailChangeFields,
    avatarPreview,
    avatarFile,
    handleAvatarSelect,
    handleUserDataUpdate,
  };
}
