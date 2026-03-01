type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role?: string;
};

type Invitation = {
  id: string;
  senderUsername: string;
  projectTitle: string;
};

type UserDataUpdate = {
  username?: string;
  email?: string;
  avatar?: string;
  old_password?: string;
  password?: string;
};
