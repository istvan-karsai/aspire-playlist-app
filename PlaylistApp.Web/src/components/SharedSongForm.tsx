import { useState } from "react";

export interface SongFormData {
    title: string;
    artist: string;
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
    initialValues = { title: "", artist: "", duration: "" },
    onSubmit,
    isPending,
    submitButtonText,
    layout = "vertical",
    onCancel,
}: SharedSongFormProps) => {
    const [title, setTitle] = useState(initialValues.title);
    const [artist, setArtist] = useState(initialValues.artist);
    const [duration, setDuration] = useState(initialValues.duration);
    const [clientError, setClientError] = useState<string | null>(null);

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setClientError(null);

        if (!title || !artist || !duration) return;

        const durationRegex = /^([0-9]{2}):([0-5][0-9]):([0-5][0-9])$/;
        
        if (!durationRegex.test(duration)) {
            setClientError("Duration must be in hh:mm:ss format.");
            return;
        }

        onSubmit({ title, artist, duration });
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    placeholder="e.g. Bohemian Rhapsody" 
                />
            </div>

            <div className={isHorizontal ? "flex-1 min-w-50" : ""}>
                <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">Artist *</label>
                <input
                    id="artist"
                    type="text"
                    required
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    placeholder="e.g. Queen" 
                />
            </div>

            <div className={isHorizontal ? "w-32" : ""}>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                <input
                    id="duration"
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

            <div className={`flex ${isHorizontal ? "" : "justify-end space-x-3 mt-4"}`}>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md h-10 flex items-center justify-center"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors h-10 flex items-center justify-center"
                >
                    {isPending ? "Saving..." : submitButtonText}
                </button>
            </div>
        </form>
    );
};