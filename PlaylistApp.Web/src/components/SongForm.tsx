import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiValidationError, createSong } from "../api/client";
import { SharedSongForm, type SongFormData } from "./SharedSongForm";
import { useState } from "react";
import { ApiMessages, UIButtons, UILabels } from "../constants/uiText";

export const SongForm = () => {
    const queryClient = useQueryClient();
    const [formKey, setFormKey] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: createSong,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['songs'] });
            setFormKey((prev) => prev + 1);
            setIsFormOpen(false);
            mutation.reset();
        },
    });

    const handleSubmit = (data: SongFormData) => {
        mutation.mutate({
            title: data.title,
            artistIds: data.artistIds,
            duration: data.duration,
        });
    };

    return (
        <div className="mb-8 w-full">
            {!isFormOpen ? (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {UIButtons.AddNewSong}
                </button>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg border w-full animate-in fade-in slide-in-from-top-2 duration-200">
                    <h2 className="text-lg font-semibold mb-4">{UILabels.AddSongHeader}</h2>

                    <SharedSongForm 
                        initialValues={{ title: "", artistIds: [], duration: "" }}
                        key={formKey}
                        onSubmit={handleSubmit}
                        isPending={mutation.isPending}
                        submitButtonText={UIButtons.Save}
                        layout="horizontal"
                        onCancel={() => setIsFormOpen(false)}
                    />

                    {mutation.isError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm w-full">
                            <strong className="font-semibold block mb-2">{ApiMessages.SaveErrorPrefix}</strong>
                            <ul className="list-disc pl-5 space-y-1">
                                {mutation.error instanceof ApiValidationError ? (
                                    mutation.error.messages.map((message, index) => (
                                        <li key={index}>{message}</li>
                                    ))
                                ) : (
                                    <li>{(mutation.error as Error).message}</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};