import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ApiValidationError } from "../../../api/core";
import { createArtist } from "../api/artistsClient";
import { SharedArtistForm, type ArtistFormData } from "./SharedArtistForm";
import { ApiMessages, UIButtons, UILabels } from "../../../constants/uiText";

export const ArtistForm = () => {
    const queryClient = useQueryClient();
    const [formKey, setFormKey] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: createArtist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artists']});
            setFormKey((prev) => prev + 1);
            setIsFormOpen(false);
            mutation.reset();
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

        mutation.mutate(payload);
    };

    return (
        <div className="mb-8 w-full">
            {!isFormOpen ? (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {UIButtons.AddNewArtist}
                </button>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg border w-full animate-in fade-in slide-in-from-top-2 duration-200">
                    <h2 className="text-lg font-semibold mb-4">{UILabels.AddArtistHeader}</h2>

                    <SharedArtistForm 
                        key={formKey}
                        onSubmit={handleSubmit}
                        isPending={mutation.isPending}
                        submitButtonText={UIButtons.Save}
                        layout="horizontal"
                        onCancel={() => setIsFormOpen(false)}
                    />

                    {mutation.isError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm w-full">
                            <strong className="font-semibold block mb-2">{ApiMessages.SaveArtistErrorPrefix}</strong>
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