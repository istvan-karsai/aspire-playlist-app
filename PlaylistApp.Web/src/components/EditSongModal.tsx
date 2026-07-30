import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Song } from "../types/song";
import { useState } from "react";
import { ApiValidationError, updateSong } from "../api/client";

interface EditSongModalProps {
    song: Song;
    onClose: () => void;
}

export const EditSongModal = ({ song, onClose }: EditSongModalProps) => {
    const queryClient = useQueryClient();

    const [title, setTitle] = useState(song.title);
    const [artist, setArtist] = useState(song.artist);
    const [duration, setDuration] = useState(song.duration || '');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const updateMutation = useMutation({
        mutationFn: (updatedSong: Omit<Song, 'id'>) => updateSong(song.id, updatedSong),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['songs'] });
            onClose();
        },
        onError: (error: Error) => {
            if (error instanceof ApiValidationError) {
                setErrorMessages(error.messages);
            } else {
                setErrorMessages([error.message]);
            }
        },
    });

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessages([]);

        const durationRegex = /^([0-9]{2}):([0-5][0-9]):([0-5][0-9])$/;
        if (!durationRegex.test(duration)) {
            setErrorMessages(['Duration must be in hh:mm:ss format.']);
            return;
        }

        updateMutation.mutate({
            title,
            artist,
            duration,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Song</h2>
                
                {errorMessages.length > 0 && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        <ul className="list-disc pl-5">
                            {errorMessages.map((msg, i) => <li key={i}>{msg}</li>)}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input 
                            type="text" 
                            required
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Artist</label>
                        <input 
                            type="text" 
                            required
                            value={artist} 
                            onChange={e => setArtist(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <input 
                            type="text" 
                            required
                            placeholder="00:05:30"
                            value={duration} 
                            onChange={e => setDuration(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            title="hh:mm:ss"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
                        >
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};