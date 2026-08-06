import { useState } from "react";
import { UIButtons, UIHints, UILabels, UIPlaceholders, ValidationMessages } from "../constants/uiText";
import { ValidationRegex } from "../constants/validation";
import { useQuery } from "@tanstack/react-query";
import type { Artist } from "../types/artist";
import { fetchArtists } from "../api/client";

export interface SongFormData {
    title: string;
    artistIds: string[];
    duration: string;
}

interface SharedSongFormProps {
    initialValues?: SongFormData;
    onSubmit: (data: SongFormData) => void;
    isPending: boolean;
    submitButtonText: string;
    layout?: "horizontal" | "vertical";
    onCancel?: () => void; // Optional: If provided, renders a Cancel button next to the Submit button.
}

export const SharedSongForm = ({
    initialValues = { title: "", artistIds: [], duration: "" },
    onSubmit,
    isPending,
    submitButtonText,
    layout = "vertical",
    onCancel,
}: SharedSongFormProps) => {
    const [title, setTitle] = useState(initialValues.title);
    const [artistIds, setArtistIds] = useState<string[]>(initialValues.artistIds);
    const [duration, setDuration] = useState(initialValues.duration);
    const [clientError, setClientError] = useState<string | null>(null);

    // Fetch artists for the multi-select dropdown
    const { data: artists, isLoading: isArtistsLoading } = useQuery<Artist[]>({
        queryKey: ['artists'],
        queryFn: fetchArtists,
    });

    const handleArtistToggle = (artistId: string) => {
        setArtistIds(prev =>
            prev.includes(artistId)
                ? prev.filter(id => id !== artistId)
                : [...prev, artistId]
        );
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setClientError(null);

        if (!title.trim()) {
            setClientError(ValidationMessages.TitleRequired);
            return;
        } 
        
        if (artistIds.length === 0) {
            setClientError(ValidationMessages.ArtistRequired);
            return;
        }

        if (!ValidationRegex.DurationFormat.test(duration)) {
            setClientError(ValidationMessages.InvalidDurationFormat);
            return;
        }

        onSubmit({ title, artistIds, duration });
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">{UILabels.InputTitleLabel}</label>
                <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    placeholder={UIPlaceholders.Title} 
                />
            </div>

            <div className={isHorizontal ? "flex-1 min-w-50" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {UILabels.Artists} {isArtistsLoading && <span className="text-gray-400 text-xs ml-2 animate-pulse">{UILabels.LoadingStatus}</span>}
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white space-y-2">
                    {artists?.map((artist) => (
                        <label key={artist.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input 
                                type="checkbox"
                                value={artist.id}
                                checked={artistIds.includes(artist.id)}
                                onChange={() => handleArtistToggle(artist.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" 
                            />
                            <span className="text-sm text-gray-700 select-none truncate">{artist.name}</span>
                        </label>
                    ))}
                    {!isArtistsLoading && artists?.length === 0 && (
                        <span className="text-sm text-gray-500 italic">{UILabels.NoArtistsAvailable}</span>
                    )}
                </div>
            </div>

            <div className={isHorizontal ? "w-32" : ""}>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">{UILabels.InputDurationLabel}</label>
                <input
                    id="duration"
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    placeholder={UIPlaceholders.Duration}
                    pattern={ValidationRegex.DurationFormat.source}
                    title={UIHints.DurationFormat} 
                />
            </div>

            <div className={`flex ${isHorizontal ? "" : "justify-end space-x-3 mt-4"}`}>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md h-10 flex items-center justify-center"
                    >
                        {UIButtons.Cancel}
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors h-10 flex items-center justify-center"
                >
                    {isPending ? UIButtons.Saving : submitButtonText}
                </button>
            </div>
        </form>
    );
};