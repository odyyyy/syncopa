
interface ProjectItemProps {
  name: string;
  updatedAt: string;
  bpm?: number;
  sampleRate?: string;
  duration?: string;
  isFavorite?: boolean;
}


type ProjectCreatePopupController = {
  isOpen: boolean;
  onClose: () => void;
  children: HTMLHtmlElement;
};
