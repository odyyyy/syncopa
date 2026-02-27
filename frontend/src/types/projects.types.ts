interface ProjectItemProps {
  title: string;
  updatedAt: string;
  membersUsername?: ProjectMember[];
}

interface ProjectCreate {
  title: string;
  invitedMembers: string[];
}

type ProjectCreatePopupController = {
  isOpen: boolean;
  onClose: () => void;
  children: HTMLHtmlElement;
};
