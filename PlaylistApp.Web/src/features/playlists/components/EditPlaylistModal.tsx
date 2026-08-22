import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Playlist, PlaylistPayload } from "../types";
import { updatePlaylist } from "../api/playlistsClient";
import { SharedPlaylistForm } from "./SharedPlaylistForm";
import { type PlaylistFormData } from "../types";
import { ApiValidationError } from "../../../core/api/client";
import { PlaylistApiMessages, PlaylistUILabels } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";

interface EditPlaylistModalProps {
    playlist: Playlist;
    onClose: () => void;
}

export const EditPlaylistModal = ({ playlist, onClose }: EditPlaylistModalProps) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: (payload: PlaylistPayload) => updatePlaylist(playlist.id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
            onClose();
        },
    });

    const handleSubmit = (data: PlaylistFormData) => {
        const payload = {
            name: data.name,
            description: data.description || null,
            songIds: data.songIds,
        };

        updateMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{PlaylistUILabels.EditPlaylistHeader}</h2>

                {updateMutation.isError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        <strong className="font-semibold block mb-2">{PlaylistApiMessages.SavePlaylistErrorPrefix}</strong>
                        <ul className="list-disc pl-5 space-y-1">
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

                <SharedPlaylistForm 
                    initialValues={{
                        name: playlist.name,
                        description: playlist.description || "",
                        songIds: playlist.songs.map(song => song.id)
                    }}
                    onSubmit={handleSubmit}
                    isPending={updateMutation.isPending}
                    submitButtonText={CoreUIButtons.SaveChanges}
                    layout="vertical"
                    onCancel={onClose}
                />
            </div>
        </div>
    );
};