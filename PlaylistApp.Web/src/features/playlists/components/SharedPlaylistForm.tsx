import { useState } from "react";
import { useSongs } from "../../songs/hooks/useSongs";
import type { PlaylistFormData } from "../types";
import { PlaylistUILabels, PlaylistUIPlaceholders, PlaylistValidationMessages } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { MultiSelectBox } from "../../../components/ui/MultiSelectBox";

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
            setClientError(PlaylistValidationMessages.NameRequired);
            return;
        }

        onSubmit({ name, description, songIds });
    };

    const isHorizontal = layout === "horizontal";

    return (
        <form onSubmit={handleSubmit} className={isHorizontal ? "flex gap-4 items-end flex-wrap" : "space-y-4"}>
            {clientError && <Alert>{clientError}</Alert>}

            <div className={isHorizontal ? "flex-1 min-w-50" : ""}>
                <Input
                    id="name" 
                    label={PlaylistUILabels.InputNameLabel}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={PlaylistUIPlaceholders.PlaylistName}
                />
            </div>

            <div className={isHorizontal ? "flex-1 min-w-50" : ""}>
                <MultiSelectBox
                    label={PlaylistUILabels.Songs}
                    isLoading={isSongsLoading}
                    emptyMessage={PlaylistUILabels.NoSongsAvailable}
                    selectedIds={songIds}
                    onToggle={handleSongToggle}
                    options={songs?.map(song => ({
                        id: song.id,
                        label: song.title,
                        subLabel: song.artists.map(a => a.name).join(', ')
                    }))}
                />
            </div>

            <div className={`w-full ${isHorizontal ? "min-w-full mt-2" : ""}`}>
                <Textarea
                    id="description"
                    label={PlaylistUILabels.InputDescriptionLabel}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={PlaylistUIPlaceholders.PlaylistDescription}
                />
            </div>

            <div className={`flex w-full ${isHorizontal ? "justify-end mt-2" : "justify-end space-x-3 mt-4"}`}>
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        className="mr-3 h-10"
                    >
                        {CoreUIButtons.Cancel}
                    </Button>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    data-testid="submit-button"
                    isLoading={isPending}
                    className="h-10 px-6"
                >
                    {isPending ? CoreUIButtons.Saving : submitButtonText}
                </Button>
            </div>
        </form>
    );
};