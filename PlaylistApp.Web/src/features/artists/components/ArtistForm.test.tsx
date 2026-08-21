import { render, screen } from "../../../tests/utils/test-utils";
import userEvent from "@testing-library/user-event";
import { ArtistForm } from "./ArtistForm";
import { describe, expect, it } from "vitest";
import { ArtistUIButtons, ArtistUILabels, ArtistValidationMessages } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";

const setupAndFillForm = async (yearValue: string) => {
    const user = userEvent.setup();
    render(<ArtistForm />);

    const addArtistButton = screen.getByRole('button', { name: ArtistUIButtons.AddNewArtist });
    await user.click(addArtistButton);

    const nameInput = screen.getByLabelText(ArtistUILabels.InputNameLabel);
    const activeFromInput = screen.getByLabelText(ArtistUILabels.InputActiveFromLabel);
    const countryInput = screen.getByLabelText(ArtistUILabels.InputCountryLabel);
    const submitButton = screen.getByRole('button', { name: CoreUIButtons.Save });

    await user.type(nameInput, 'Test Artist Name');
    await user.type(countryInput, 'Hungary');
    await user.type(activeFromInput, yearValue);

    return { user, submitButton };
};

describe('ArtistForm Component', () => {
    it('shows a client-side validation error if the active from year is out of bounds', async () => {
        // Fill form with an invalid year (1700 is below the 1800 minimum)
        const { user , submitButton } = await setupAndFillForm('1700');

        await user.click(submitButton);

        expect(await screen.findByText(ArtistValidationMessages.InvalidYear)).toBeInTheDocument();
    });

    it('successfully submits the form with valid data and clears inputs', async () => {
        // Arrange & Act: Fill form with a valid year
        const { user, submitButton } = await setupAndFillForm('2015');
        await user.click(submitButton);

        // Wait for the form to automatically close upon success
        const addArtistButton = await screen.findByRole('button', { name: ArtistUIButtons.AddNewArtist });
        expect(addArtistButton).toBeInTheDocument();

        // Re-open the form
        await user.click(addArtistButton);

        // Assert: Verify the inputs were completely remounted and cleared
        expect(screen.getByLabelText(ArtistUILabels.InputNameLabel)).toHaveValue('');
        expect(screen.getByLabelText(ArtistUILabels.InputCountryLabel)).toHaveValue('');
        
        // For number inputs in React Testing Library, an empty string is asserted like this:
        expect(screen.getByLabelText(ArtistUILabels.InputActiveFromLabel)).toHaveValue(null);
    });
});