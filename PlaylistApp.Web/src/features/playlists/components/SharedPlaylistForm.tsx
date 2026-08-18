import { useState } from "react";
import { useSongs } from "../../songs/hooks/useSongs";
import { UIButtons, UILabels, UIPlaceholders, ValidationMessages } from "../../../constants/uiText";
import type { PlaylistFormData } from "../types";

interface SharedPlaylistFormProps {
    initialValues?: PlaylistFormData;
    onSubmit: (data: PlaylistFormData) => void;
    isPending: boolean;
    submitButtonText: string;
    layout: "horizontal" | "vertical";
    onCancel?: () => void;
}

export const SharedPlaylistForm = ({
    initialValues = { name: "", description: "", songIds: [] },
    onSubmit,
    isPending,
    submitButtonText,
    layout = "vertical",
    onCancel
}: SharedPlaylistFormProps) => {
    const [name, setName] = useState(initialValues.name);
    const [description, setDescription] = useState(initialValues.description);
    const [songIds, setSongIds] = useState(initialValues.songIds);
    const [clientError, setClientError] = useState<string | null>(null);

    // Fetch songs for the multi-select dropdown
    const { data: songs, isLoading: isSongsLoading } = useSongs();

    const handleSongToggle = (songId: string) => {
        setSongIds(prev => 
            prev.includes(songId)
                ? prev.filter(id => id !== songId)
                : [...prev, songId]
        );
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setClientError(null);

        if (!name.trim()) {
            setClientError(ValidationMessages.NameRequired);
            return;
        }

        onSubmit({ name, description, songIds });
    };

    const isHorizontal = layout === "horizontal";

    return (
        <form onSubmit={handleSubmit} className={isHorizontal ? "flex gap-4 items-end flex-wrap" : "space-y-4"}>
            {clientError && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md w-full text-sm">
                    {clientError}
                </div>
            )}

            <div className={isHorizontal ? "flex-1 min-w-50" : ""}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{UILabels.InputNameLabel}</label>
                <input
                    id="name" 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    placeholder={UIPlaceholders.PlaylistName}
                />
            </div>

            <div className={isHorizontal ? "flex-1 min-w-50" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {UILabels.Songs} {isSongsLoading && <span className="text-gray-400 text-xs ml-2 animate-pulse">{UILabels.LoadingStatus}</span>}
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white space-y-2">
                    {songs?.map((song) => (
                        <label key={song.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input 
                                type="checkbox"
                                value={song.id}
                                checked={songIds.includes(song.id)}
                                onChange={() => handleSongToggle(song.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" 
                            />
                            {/* Appending artist names to song titles for better UX */}
                            <span className="text-sm text-gray-700 select-none truncate">
                                {song.title} <span className="text-gray-400 text-xs">- {song.artists.map(artist => artist.name).join(', ')}</span>
                            </span>
                        </label>
                    ))}
                    {!isSongsLoading && songs?.length === 0 && (
                        <span className="text-sm text-gray-500 italic">{UILabels.NoSongsAvailable}</span>
                    )}
                </div>
            </div>

            <div className={`w-full ${isHorizontal ? "min-w-full mt-2" : ""}`}>
                <label htmlFor="description" className="">{UILabels.InputDescriptionLabel}</label>
                <textarea 
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white resize-y"
                    placeholder={UIPlaceholders.PlaylistDescription}
                />
            </div>

            <div className={`flex w-full ${isHorizontal ? "justify-end mt-2" : "justify-end space-x-3 mt-4"}`}>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 mr-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md h-10 flex items-center justify-center"
                    >
                        {UIButtons.Cancel}
                    </button>
                )}

                <button
                    type="submit"
                    data-testid="submit-button"
                    disabled={isPending}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors h-10 flex items-center justify-center"
                >
                    {isPending ? UIButtons.Saving : submitButtonText}
                </button>
            </div>
        </form>
    );
};