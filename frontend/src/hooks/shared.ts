export function createFieldHandler<T extends Record<string, any>>(
  setter: (key: keyof T, value: T[keyof T]) => void,
) {
  return (
    e: Event & {
      currentTarget: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    },
  ) => {
    const { name, value } = e.currentTarget;
    setter(name as keyof T, value as any);
  };
}
