import { Video } from "../services/video.interface";

export interface AddEditVideoDialogProps {
    onClose: () => void;
    video?: Video;
    isOpen: boolean;
}
