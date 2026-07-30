import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ApiValidationError, createSong } from "../api/client";

export const SongForm = () => {
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [duration, setDuration] = useState('');

    const mutation = useMutation({
        mutationFn: createSong,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['songs'] });

            setTitle('');
            setArtist('');
            setDuration('');
        },
    });

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !artist || !duration) return;

        mutation.mutate({
            title,
            artist,
            duration
        });
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg border mb-8 w-full">
            <h2 className="text-lg font-semibold mb-4">Add a New Song</h2>

            <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
                <div className="flex-1 min-w-50">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input 
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                        placeholder="e.g. Bohemian Rhapsody"
                    />
                </div>
                <div className="flex-1 min-w-50">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Artist *</label>
                    <input 
                        type="text"
                        required
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                        placeholder="e.g. Queen"
                    />
                </div>
                <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                    <input 
                        type="text"
                        required
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                        placeholder="00:03:45"
                        pattern="^[0-9]{2}:[0-5][0-9]:[0-5][0-9]$"
                        title="hh:mm:ss"
                    />
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors h-10.5"
                >
                    {mutation.isPending ? 'Saving...' : 'Save'}
                </button>
            </form>

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