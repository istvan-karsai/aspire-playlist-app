import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiValidationError, createSong } from "../api/client";
import { SharedSongForm, type SongFormData } from "./SharedSongForm";
import { useState } from "react";

export const SongForm = () => {
    const queryClient = useQueryClient();

    const [formKey, setFormKey] = useState(0);

    const mutation = useMutation({
        mutationFn: createSong,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['songs'] });

            setFormKey((prev) => prev + 1);

            mutation.reset();
        },
    });

    const handleSubmit = (data: SongFormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg border mb-8 w-full">
            <h2 className="text-lg font-semibold mb-4">Add a New Song</h2>

            <SharedSongForm 
                key={formKey}
                onSubmit={handleSubmit}
                isPending={mutation.isPending}
                submitButtonText="Save"
                layout="horizontal"
            />

            {mutation.isError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm w-full">
                    <strong className="font-semibold block mb-2">Failed to save song because of the following error(s):</strong>
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
    );
};