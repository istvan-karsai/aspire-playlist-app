import { useState } from "react";
import { SharedPlaylistForm } from "./SharedPlaylistForm";
import { type PlaylistFormData } from "../types";
import { ApiValidationError } from "../../../core/api/client";
import { PlaylistApiMessages, PlaylistUIButtons, PlaylistUILabels } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { useCreatePlaylist } from "../hooks/usePlaylists";

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
        <div className="mb-8 w-full">
            {!isFormOpen ? (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {PlaylistUIButtons.AddNewPlaylist}
                </button>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg border w-full animate-in fade-in slide-in-from-top-2 duration-200">
                    <h2 className="text-lg font-semibold mb-4">{PlaylistUILabels.AddPlaylistHeader}</h2>

                    <SharedPlaylistForm 
                        key={formKey}
                        onSubmit={handleSubmit}
                        isPending={isPending}
                        submitButtonText={CoreUIButtons.Save}
                        layout="horizontal"
                        onCancel={() => setIsFormOpen(false)}
                    />

                    {isError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm w-full">
                            <strong className="font-semibold block mb-2">{PlaylistApiMessages.SavePlaylistErrorPrefix}</strong>
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