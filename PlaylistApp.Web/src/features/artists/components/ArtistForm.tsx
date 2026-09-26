import { useState } from "react";
import { SharedArtistForm, type ArtistFormData } from "./SharedArtistForm";
import { ArtistApiMessages, ArtistUIButtons, ArtistUILabels } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { useCreateArtist } from "../hooks/useArtists";
import { FormErrorAlert } from "../../../components/ui/FormErrorAlert";
import { CollapsibleCard } from "../../../components/ui/CollapsibleCard";

export const ArtistForm = () => {
    const [formKey, setFormKey] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { mutate: createArtist, reset, isPending, isError, error } = useCreateArtist();

    const handleSubmit = (data: ArtistFormData) => {
        const payload = {
            name: data.name,
            bio: data.bio || undefined,
            activeFromYear: data.activeFromYear === "" ? undefined : data.activeFromYear,
            country: data.country || undefined,
            imageUrl: data.imageUrl || undefined,
        };

        createArtist(
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
            triggerText={ArtistUIButtons.AddNewArtist}
            title={ArtistUILabels.AddArtistHeader}
        >
                    <SharedArtistForm 
                        key={formKey}
                        onSubmit={handleSubmit}
                        isPending={isPending}
                        submitButtonText={CoreUIButtons.Save}
                        layout="horizontal"
                        onCancel={() => setIsFormOpen(false)}
                    />

                    {isError && error && (
                        <FormErrorAlert error={error} titlePrefix={ArtistApiMessages.SaveArtistErrorPrefix}/>
                    )}
        </CollapsibleCard>
    );
};