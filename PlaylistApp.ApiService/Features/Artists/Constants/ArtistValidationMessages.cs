namespace PlaylistApp.ApiService.Features.Artists.Constants;

public static class ArtistValidationMessages
{
    public const string NameRequired = "Name is required.";
    public const string NameMaxLength = "Name cannot exceed {MaxLength} characters.";
    public const string BioMaxLength = "Bio cannot exceed {MaxLength} characters.";
    public const string CountryMaxLength = "Country cannot exceed {MaxLength} characters.";
    public const string ImageUrlMaxLength = "Image URL cannot exceed {MaxLength} characters.";
    public const string InvalidYear = "Active From Year must be between {From} and {To}.";
}