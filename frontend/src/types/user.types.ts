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

type InvitationChangeStatus= {
  project_id: string;
  expires: string;
  id: string;
  to_user_id: string;
  status: "accepted" | "rejected";
  from_user_id: string;
};


type InvitationPatchResponse = {
  invitation: InvitationChangeStatus;
  project?: ProjectItemProps;
};

type UserDataUpdate = {
  username?: string;
  email?: string;
  avatar?: string;
  old_password?: string;
  password?: string;
};
