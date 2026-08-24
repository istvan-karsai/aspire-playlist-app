import type { Song } from "../types";
import { ApiValidationError } from "../../../core/api/client";
import { SharedSongForm, type SongFormData } from "./SharedSongForm";
import { SongUILabels } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { useUpdateSong } from "../hooks/useSongs";

interface EditSongModalProps {
    song: Song;
    onClose: () => void;
}

export const EditSongModal = ({ song, onClose }: EditSongModalProps) => {
    const { mutate: updateSong, isPending, isError, error } = useUpdateSong();
    
    const handleSubmit = (data: SongFormData) => {
        const payload = {
            title: data.title,
            artistIds: data.artistIds,
            duration: data.duration
        };

        updateSong(
            {
                id: song.id,
                payload
            },
            {
                onSuccess: () => onClose()
            }

        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{SongUILabels.EditSongHeader}</h2>
                
                {isError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        <ul className="list-disc pl-5">
                            {error instanceof ApiValidationError ? (
                                error.messages.map((msg, i) => 
                                    <li key={i}>{msg}</li>
                                )
                            ) : (
                                <li>{(error as Error).message}</li>
                            )}
                        </ul>
                    </div>
                )}

                <SharedSongForm 
                    initialValues={{
                        title: song.title,
                        artistIds: song.artists.map((artist) => artist.id),
                        duration: song.duration || ''
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