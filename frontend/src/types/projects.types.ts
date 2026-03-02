interface ProjectItemProps {
  id: string;
  title: string;
  modifiedAt: string;
  invitedMembers: ProjectMember[];
}

type ProjectMember = {
  username: string;
  avatar?: string;
};

type MemberAvatarProps = {
  username: string;
  avatar?: string;
};

interface ProjectCreate {
  title: string;
  invitedMembers: string[];
}

type ProjectCreatePopupController = {
  isOpen: boolean;
  onClose: () => void;
  children: HTMLHtmlElement;
};
