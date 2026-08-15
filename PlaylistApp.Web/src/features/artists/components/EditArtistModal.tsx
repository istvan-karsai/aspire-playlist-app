import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Artist } from "../types";
import { ApiValidationError } from "../../../api/core";
import { updateArtist } from "../api/artistsClient";
import { SharedArtistForm, type ArtistFormData } from "./SharedArtistForm";
import { UIButtons, UILabels } from "../../../constants/uiText";

interface EditArtistModalProps {
    artist: Artist;
    onClose: () => void;
}

export const EditArtistModal = ({ artist, onClose }: EditArtistModalProps) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: (updatedArtist: Omit<Artist, 'id'>) => updateArtist(artist.id, updatedArtist),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artists'] });
            onClose();
        },
    });

    const handleSubmit = (data: ArtistFormData) => {
        const payload = {
            name: data.name,
            bio: data.bio || undefined,
            activeFromYear: data.activeFromYear === "" ? undefined : data.activeFromYear,
            country: data.country || undefined,
            imageUrl: data.imageUrl || undefined,
        };

        updateMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg my-8">
                <h2 className="text-xl font-bold mb-4">{UILabels.EditArtistHeader}</h2>

                {updateMutation.isError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        <ul className="list-disc pl-5">
                            {updateMutation.error instanceof ApiValidationError ? (
                                updateMutation.error.messages.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))
                            ) : (
                                <li>{(updateMutation.error as Error).message}</li>
                            )}
                        </ul>
                    </div>
                )}

                <SharedArtistForm 
                    initialValues={{
                        name: artist.name,
                        bio: artist.bio || "",
                        activeFromYear: artist.activeFromYear || "",
                        country: artist.country || "",
                        imageUrl: artist.imageUrl || ""
                    }}
                    onSubmit={handleSubmit}
                    isPending={updateMutation.isPending}
                    submitButtonText={UIButtons.SaveChanges}
                    layout="vertical"
                    onCancel={onClose}
                />
            </div>
        </div>
    );
};