import { createStore } from "solid-js/store";

const [userData, setUserData] = createStore<User>({
  id: "",
  username: "",
  email: "",
  avatar: "",
  role: "",
});

export { userData, setUserData };
