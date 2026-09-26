import { useState } from "react";
import { SharedPlaylistForm } from "./SharedPlaylistForm";
import { type PlaylistFormData } from "../types";
import { PlaylistApiMessages, PlaylistUIButtons, PlaylistUILabels } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { useCreatePlaylist } from "../hooks/usePlaylists";
import { FormErrorAlert } from "../../../components/ui/FormErrorAlert";
import { CollapsibleCard } from "../../../components/ui/CollapsibleCard";

export const PlaylistForm = () => {
    const [formKey, setFormKey] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { mutate: createPlaylist, reset, isPending, isError, error } = useCreatePlaylist();

    const handleSubmit = (data: PlaylistFormData) => {
        const payload = {
            name: data.name,
            description: data.description || null,
            songIds: data.songIds,
        };

        createPlaylist(
            payload,
            {
                onSuccess: () => {
                    setFormKey((prev) => prev + 1);
                    setIsFormOpen(false);
                    reset();
                }
            }
        );
    };

    return (
        <CollapsibleCard
            isOpen={isFormOpen}
            onToggle={setIsFormOpen}
            triggerText={PlaylistUIButtons.AddNewPlaylist}
            title={PlaylistUILabels.AddPlaylistHeader}
        >
                    <SharedPlaylistForm 
                        key={formKey}
                        onSubmit={handleSubmit}
                        isPending={isPending}
                        submitButtonText={CoreUIButtons.Save}
                        layout="horizontal"
                        onCancel={() => setIsFormOpen(false)}
                    />

                    {isError && error && (
                        <FormErrorAlert error={error} titlePrefix={PlaylistApiMessages.SavePlaylistErrorPrefix}/>
                    )}
        </CollapsibleCard>
    );
};