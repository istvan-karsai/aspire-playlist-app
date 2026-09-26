import type { Artist } from "../types";
import { SharedArtistForm, type ArtistFormData } from "./SharedArtistForm";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { ArtistUILabels } from "../constants/uiText";
import { useUpdateArtist } from "../hooks/useArtists";
import { Modal } from "../../../components/ui/Modal";
import { FormErrorAlert } from "../../../components/ui/FormErrorAlert";

interface EditArtistModalProps {
    artist: Artist;
    onClose: () => void;
}

export const EditArtistModal = ({ artist, onClose }: EditArtistModalProps) => {
    const { mutate: updateArtist, isPending, isError, error } = useUpdateArtist();

    const handleSubmit = (data: ArtistFormData) => {
        const payload = {
            name: data.name,
            bio: data.bio || undefined,
            activeFromYear: data.activeFromYear === "" ? undefined : data.activeFromYear,
            country: data.country || undefined,
            imageUrl: data.imageUrl || undefined,
        };

        updateArtist(
            {
                id: artist.id,
                payload
            },
            {
                onSuccess: () => onClose()
            }
        );
    };

    return (
        <Modal
            title={ArtistUILabels.EditArtistHeader}
            onClose={onClose}
            maxWidth="lg"
        >
                {isError && error && <FormErrorAlert error={error} />}

                <SharedArtistForm 
                    initialValues={{
                        name: artist.name,
                        bio: artist.bio || "",
                        activeFromYear: artist.activeFromYear || "",
                        country: artist.country || "",
                        imageUrl: artist.imageUrl || ""
                    }}
                    onSubmit={handleSubmit}
                    isPending={isPending}
                    submitButtonText={CoreUIButtons.SaveChanges}
                    layout="vertical"
                    onCancel={onClose}
                />
        </Modal>
    );
};