import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Song } from "../types/song";
import { ApiValidationError, updateSong } from "../api/client";
import { SharedSongForm, type SongFormData } from "./SharedSongForm";

interface EditSongModalProps {
    song: Song;
    onClose: () => void;
}

export const EditSongModal = ({ song, onClose }: EditSongModalProps) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: (updatedSong: Omit<Song, 'id'>) => updateSong(song.id, updatedSong),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['songs'] });
            onClose();
        },
    });

    const handleSubmit = (data: SongFormData) => {
        updateMutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Song</h2>
                
                {updateMutation.isError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        <ul className="list-disc pl-5">
                            {updateMutation.error instanceof ApiValidationError ? (
                                updateMutation.error.messages.map((msg, i) => 
                                    <li key={i}>{msg}</li>
                                )
                            ) : (
                                <li>{(updateMutation.error as Error).message}</li>
                            )}
                        </ul>
                    </div>
                )}

                <SharedSongForm 
                    initialValues={{
                        title: song.title,
                        artist: song.artist,
                        duration: song.duration || ''
                    }}
                    onSubmit={handleSubmit}
                    isPending={updateMutation.isPending}
                    submitButtonText="Save Changes"
                    layout="vertical"
                    onCancel={onClose}
                />
            </div>
        </div>
    );
};