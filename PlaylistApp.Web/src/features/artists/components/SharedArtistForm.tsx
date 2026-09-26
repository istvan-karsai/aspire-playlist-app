import { useState } from "react";
import { ValidationBounds } from "../constants/validation";
import { ArtistUILabels, ArtistUIPlaceholders, ArtistValidationMessages } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";

export interface ArtistFormData {
    name: string;
    bio: string;
    activeFromYear: number | "";
    country: string;
    imageUrl: string;
}

interface SharedArtistFormProps {
    initialValues?: ArtistFormData;
    onSubmit: (data: ArtistFormData) => void;
    isPending: boolean;
    submitButtonText: string;
    layout?: "horizontal" | "vertical";
    onCancel?: () => void;
}

export const SharedArtistForm = ({
    initialValues = { name: "", bio: "", activeFromYear: "", country: "", imageUrl: "" },
    onSubmit,
    isPending,
    submitButtonText,
    layout = "vertical",
    onCancel
}: SharedArtistFormProps) => {
    const [name, setName] = useState(initialValues.name);
    const [bio, setBio] = useState(initialValues.bio);
    const [activeFromYear, setActiveFromYear] = useState(initialValues.activeFromYear);
    const [country, setCountry] = useState(initialValues.country);
    const [imageUrl, setImageUrl] = useState(initialValues.imageUrl);
    const [clientError, setClientError] = useState<string | null>(null);

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setClientError(null);

        if (!name.trim()) {
            setClientError("Artist Name is required.");
            return;
        }

        if (
            activeFromYear !== "" 
            && (activeFromYear < ValidationBounds.ArtistMinActiveYear 
                || activeFromYear > ValidationBounds.ArtistMaxActiveYear)
        ) {
            setClientError(ArtistValidationMessages.InvalidYear);
            return;
        }

        onSubmit({ name, bio, activeFromYear, country, imageUrl });
    };

    const isHorizontal = layout === "horizontal";

    return (
        <form onSubmit={handleSubmit} className={isHorizontal ? "flex gap-4 items-end flex-wrap" : "space-y-4"}>

            {clientError && <Alert>{clientError}</Alert>}

            <div className={isHorizontal ? "flex-1 min-w-50" : ""}>
                <Input 
                    id="name"
                    label={ArtistUILabels.InputNameLabel}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={ArtistUIPlaceholders.Name}
                />
            </div>
            
            <div className={isHorizontal ? "w-32" : ""}>
                <Input 
                    id="activeFromYear"
                    label={ArtistUILabels.InputActiveFromLabel}
                    type="number"
                    value={activeFromYear}
                    onChange={(e) => setActiveFromYear(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder={ArtistUIPlaceholders.ActiveFrom}
                />
            </div>

            <div className={isHorizontal ? "flex-1 min-w-37.5" : ""}>
                <Input
                    id="country"
                    label={ArtistUILabels.InputCountryLabel}
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder={ArtistUIPlaceholders.Country}
                />
            </div>

            <div className={`w-full ${isHorizontal ? "min-w-full mt-2" : ""}`}>
                <Input
                    id="imageUrl"
                    label={ArtistUILabels.InputImageLabel}
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder={ArtistUIPlaceholders.ImageUrl}
                />
            </div>

            <div className={`w-full ${isHorizontal ? "min-w-full mt-2" : ""}`}>
                <Textarea
                    id="bio"
                    label={ArtistUILabels.InputBioLabel}
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={ArtistUIPlaceholders.Bio}
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