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

type RefreshResponse = {
  access_token: string;
};

type AuthContextType = {
  accessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  refresh: () => Promise<void>;
  loading: () => boolean;
};


interface ProtectedProps {
  children: any;
  redirectTo?: string;
}

interface LoginResponse {
  access_token: string;
}