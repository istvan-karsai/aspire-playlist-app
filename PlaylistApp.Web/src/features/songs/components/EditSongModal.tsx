import type { Song } from "../types";
import { SharedSongForm, type SongFormData } from "./SharedSongForm";
import { SongUILabels } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { useUpdateSong } from "../hooks/useSongs";
import { Modal } from "../../../components/ui/Modal";
import { FormErrorAlert } from "../../../components/ui/FormErrorAlert";

interface EditSongModalProps {
    song: Song;
    onClose: () => void;
}

export const EditSongModal = ({ song, onClose }: EditSongModalProps) => {
    const { mutate: updateSong, isPending, isError, error } = useUpdateSong();
    
    const handleSubmit = (data: SongFormData) => {
        const payload = {
            title: data.title,
            artistIds: data.artistIds,
            duration: data.duration
        };

        updateSong(
            {
                id: song.id,
                payload
            },
            {
                onSuccess: () => onClose()
            }

        );
    };

    return (
        <Modal
            title={SongUILabels.EditSongHeader}
            onClose={onClose}
        >
                
                {isError && error && <FormErrorAlert error={error} />}

                <SharedSongForm 
                    initialValues={{
                        title: song.title,
                        artistIds: song.artists.map((artist) => artist.id),
                        duration: song.duration || ''
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