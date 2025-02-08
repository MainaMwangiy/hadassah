
export interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    content: string;
    onCancel: () => void;
    onConfirm: () => void;
    confirmDiscard?: string;
}