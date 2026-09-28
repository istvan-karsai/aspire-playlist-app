import { Modal } from "./Modal";
import { Button } from "./Button";
import { CoreUIButtons } from "../../core/constants/uiText";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isPending?: boolean;
}

export const ConfirmDialog = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isPending = false
}: ConfirmDialogProps) => {
    return (
        <Modal title={title} isOpen={isOpen} onClose={onCancel} maxWidth="md">
            <div className="mb-6">
                <p className="text-sm text-gray-600">{message}</p>
            </div>
            <div className="flex justify-end space-x-3">
                <Button 
                    variant="secondary" 
                    onClick={onCancel} 
                    disabled={isPending}
                >
                    {CoreUIButtons.Cancel}
                </Button>
                <Button 
                    variant="danger" 
                    onClick={onConfirm} 
                    isLoading={isPending}
                >
                    {isPending ? CoreUIButtons.Deleting : CoreUIButtons.Delete}
                </Button>
            </div>
        </Modal>
    );
};