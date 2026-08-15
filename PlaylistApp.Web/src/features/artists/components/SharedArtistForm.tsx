import { useState } from "react";
import { UIButtons, UILabels, UIPlaceholders, ValidationMessages } from "../../../constants/uiText";
import { ValidationBounds } from "../../../constants/validation";

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
            setClientError(ValidationMessages.InvalidYear);
            return;
        }

        onSubmit({ name, bio, activeFromYear, country, imageUrl });
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
                    placeholder={UIPlaceholders.Name}
                />
            </div>
            
            <div className={isHorizontal ? "w-32" : ""}>
                <label htmlFor="activeFromYear" className="block text-sm font-medium text-gray-700 mb-1">{UILabels.InputActiveFromLabel}</label>
                <input 
                    id="activeFromYear"
                    type="number"
                    value={activeFromYear}
                    onChange={(e) => setActiveFromYear(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    placeholder={UIPlaceholders.ActiveFrom}
                />
            </div>

            <div className={isHorizontal ? "flex-1 min-w-37.5" : ""}>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">{UILabels.InputCountryLabel}</label>
                <input 
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    placeholder={UIPlaceholders.Country}
                />
            </div>

            <div className={`w-full ${isHorizontal ? "min-w-full mt-2" : ""}`}>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">{UILabels.InputImageLabel}</label>
                <input 
                    id="imageUrl"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                    placeholder={UIPlaceholders.ImageUrl}
                />
            </div>

            <div className={`w-full ${isHorizontal ? "min-w-full mt-2" : ""}`}>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">{UILabels.InputBioLabel}</label>
                <textarea 
                    id="bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white resize-y"
                    placeholder={UIPlaceholders.Bio}
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