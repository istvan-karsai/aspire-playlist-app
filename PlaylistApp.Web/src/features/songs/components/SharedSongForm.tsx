import { useState } from "react";
import { FormatConstants, ValidationRegex } from "../constants/validation";
import { useArtists } from "../../artists/hooks/useArtists";
import { SongUIHints, SongUILabels, SongUIPlaceholders, SongValidationMessages } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { MultiSelectBox } from "../../../components/ui/MultiSelectBox";

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
    const { data: artists, isLoading: isArtistsLoading } = useArtists();

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
            setClientError(SongValidationMessages.TitleRequired);
            return;
        } 
        
        if (artistIds.length === 0) {
            setClientError(SongValidationMessages.ArtistRequired);
            return;
        }

        if (!ValidationRegex.DurationFormat.test(duration)) {
            setClientError(SongValidationMessages.InvalidDurationFormat);
            return;
        }

        if (duration === FormatConstants.ZeroDuration) {
            setClientError(SongValidationMessages.DurationGreaterThanZero);
            return;
        }

        onSubmit({ title, artistIds, duration });
    };

    const isHorizontal = layout === "horizontal";

    return (
        <form onSubmit={handleSubmit} className={isHorizontal ? "flex gap-4 items-end flex-wrap" : "space-y-4"}>
            
            {clientError && <Alert>{clientError}</Alert>}

            <div className={isHorizontal ? "flex-1 min-w-50" : ""}>
                <Input
                    id="title"
                    label={SongUILabels.InputTitleLabel}
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={SongUIPlaceholders.Title} 
                />
            </div>

            <div className={isHorizontal ? "flex-1 min-w-50" : ""}>
                <MultiSelectBox 
                    label={SongUILabels.Artists}
                    isLoading={isArtistsLoading}
                    emptyMessage={SongUILabels.NoArtistsAvailable}
                    selectedIds={artistIds}
                    onToggle={handleArtistToggle}
                    options={artists?.map(artist => ({
                        id: artist.id,
                        label: artist.name
                    }))}
                />
            </div>

            <div className={isHorizontal ? "w-32" : ""}>
                <Input
                    id="duration"
                    label={SongUILabels.InputDurationLabel}
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder={SongUIPlaceholders.Duration}
                    pattern={ValidationRegex.DurationFormat.source}
                    title={SongUIHints.DurationFormat} 
                />
            </div>

            <div className={`flex ${isHorizontal ? "" : "justify-end space-x-3 mt-4"}`}>
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