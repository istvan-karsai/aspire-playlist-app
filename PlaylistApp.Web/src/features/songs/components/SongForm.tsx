import { ApiValidationError } from "../../../core/api/client";
import { SharedSongForm, type SongFormData } from "./SharedSongForm";
import { useState } from "react";
import { SongApiMessages, SongUIButtons, SongUILabels } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { useCreateSong } from "../hooks/useSongs";

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
        <div className="mb-8 w-full">
            {!isFormOpen ? (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {SongUIButtons.AddNewSong}
                </button>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg border w-full animate-in fade-in slide-in-from-top-2 duration-200">
                    <h2 className="text-lg font-semibold mb-4">{SongUILabels.AddSongHeader}</h2>

                    <SharedSongForm 
                        initialValues={{ title: "", artistIds: [], duration: "" }}
                        key={formKey}
                        onSubmit={handleSubmit}
                        isPending={isPending}
                        submitButtonText={CoreUIButtons.Save}
                        layout="horizontal"
                        onCancel={() => setIsFormOpen(false)}
                    />

                    {isError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm w-full">
                            <strong className="font-semibold block mb-2">{SongApiMessages.SaveErrorPrefix}</strong>
                            <ul className="list-disc pl-5 space-y-1">
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
                </div>
            )}
        </div>
    );
};