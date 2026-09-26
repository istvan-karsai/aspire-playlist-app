import type { Playlist } from "../types";
import { SharedPlaylistForm } from "./SharedPlaylistForm";
import { type PlaylistFormData } from "../types";
import { PlaylistApiMessages, PlaylistUILabels } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { useUpdatePlaylist } from "../hooks/usePlaylists";
import { Modal } from "../../../components/ui/Modal";
import { FormErrorAlert } from "../../../components/ui/FormErrorAlert";

interface EditPlaylistModalProps {
    playlist: Playlist;
    onClose: () => void;
}

export const EditPlaylistModal = ({ playlist, onClose }: EditPlaylistModalProps) => {
    const { mutate: updatePlaylist, isPending, isError, error } = useUpdatePlaylist();

    const handleSubmit = (data: PlaylistFormData) => {
        const payload = {
            name: data.name,
            description: data.description || null,
            songIds: data.songIds,
        };

        updatePlaylist(
            {
                id: playlist.id,
                payload
            },
            {
                onSuccess: () => onClose()
            }
        );
    };

    return (
        <Modal
            title={PlaylistUILabels.EditPlaylistHeader}
            onClose={onClose}
        >

                {isError && error && (
                    <FormErrorAlert error={error} titlePrefix={PlaylistApiMessages.SavePlaylistErrorPrefix} />
                )}

                <SharedPlaylistForm 
                    initialValues={{
                        name: playlist.name,
                        description: playlist.description || "",
                        songIds: playlist.songs.map(song => song.id)
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