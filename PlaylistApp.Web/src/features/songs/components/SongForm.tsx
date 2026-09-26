import { SharedSongForm, type SongFormData } from "./SharedSongForm";
import { useState } from "react";
import { SongApiMessages, SongUIButtons, SongUILabels } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { useCreateSong } from "../hooks/useSongs";
import { FormErrorAlert } from "../../../components/ui/FormErrorAlert";
import { CollapsibleCard } from "../../../components/ui/CollapsibleCard";

export const SongForm = () => {
    const [formKey, setFormKey] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { mutate: createSong, reset, isPending, isError, error } = useCreateSong();

    const handleSubmit = (data: SongFormData) => {
        const payload = {
            title: data.title,
            artistIds: data.artistIds,
            duration: data.duration,
        };

        createSong(
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
            triggerText={SongUIButtons.AddNewSong}
            title={SongUILabels.AddSongHeader}
        >
                    <SharedSongForm 
                        initialValues={{ title: "", artistIds: [], duration: "" }}
                        key={formKey}
                        onSubmit={handleSubmit}
                        isPending={isPending}
                        submitButtonText={CoreUIButtons.Save}
                        layout="horizontal"
                        onCancel={() => setIsFormOpen(false)}
                    />

                    {isError && error && (
                        <FormErrorAlert error={error} titlePrefix={SongApiMessages.SaveErrorPrefix}/>
                    )}
        </CollapsibleCard>
    );
};