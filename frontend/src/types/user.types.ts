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
}