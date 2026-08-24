import type { Artist } from "../types";
import { ApiValidationError } from "../../../core/api/client";
import { SharedArtistForm, type ArtistFormData } from "./SharedArtistForm";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { ArtistUILabels } from "../constants/uiText";
import { useUpdateArtist } from "../hooks/useArtists";

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg my-8">
                <h2 className="text-xl font-bold mb-4">{ArtistUILabels.EditArtistHeader}</h2>

                {isError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        <ul className="list-disc pl-5">
                            {error instanceof ApiValidationError ? (
                                error.messages.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))
                            ) : (
                                <li>{(error as Error).message}</li>
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
                    isPending={isPending}
                    submitButtonText={CoreUIButtons.SaveChanges}
                    layout="vertical"
                    onCancel={onClose}
                />
            </div>
        </div>
    );
};