type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
};

type LoginFormData = {
  email: string;
  password: string;
};

type CustomInputEvent = {
  currentTarget: HTMLInputElement;
  target: Element;
};
