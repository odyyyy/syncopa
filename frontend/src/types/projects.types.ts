interface ProjectItemProps {
  id: string;
  title: string;
  modifiedAt: string;
  invitedMembers: ProjectMember[];
}

type ProjectMember = {
  id: string;
  username: string;
  avatar?: string | null;
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
