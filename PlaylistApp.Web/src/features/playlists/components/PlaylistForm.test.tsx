import { render, screen } from "../../../tests/utils/test-utils";
import userEvent from "@testing-library/user-event";
import { PlaylistForm } from "./PlaylistForm";
import { describe, expect, it } from "vitest";
import { PlaylistUIButtons, PlaylistUILabels, PlaylistValidationMessages } from "../constants/uiText";
import { CoreUIButtons } from "../../../core/constants/uiText";

const setupAndFillForm = async () => {
    const user = userEvent.setup();
    render(<PlaylistForm />);

    const addPlaylistButton = screen.getByRole('button', { name: PlaylistUIButtons.AddNewPlaylist });
    await user.click(addPlaylistButton);

    const nameInput = screen.getByLabelText(PlaylistUILabels.InputNameLabel);
    const descriptionInput = screen.getByLabelText(PlaylistUILabels.InputDescriptionLabel);
    const submitButton = screen.getByRole('button', { name: CoreUIButtons.Save });

    await user.type(nameInput, 'My New Test Playlist');
    await user.type(descriptionInput, 'This is a test description');

    return { user, submitButton, nameInput, descriptionInput };
};

describe('PlaylistForm Component', () => {
    it('shows a client-side validation error if the required name is missing', async () => {
        const user = userEvent.setup();
        render(<PlaylistForm />);

        await user.click(screen.getByRole('button', { name: PlaylistUIButtons.AddNewPlaylist }));
        
        const submitButton = screen.getByRole('button', { name: CoreUIButtons.Save });
        
        document.querySelector('form')?.setAttribute('novalidate', 'true');
        await user.click(submitButton);

        expect(await screen.findByText(PlaylistValidationMessages.NameRequired)).toBeInTheDocument();
    });

    it('successfully submits the form with valid data and clears inputs upon reopen', async () => {
        // Arrange & Act
        const { user, submitButton } = await setupAndFillForm();
        await user.click(submitButton);

        // Wait for the form to automatically close upon success
        const addPlaylistButton = await screen.findByRole('button', { name: PlaylistUIButtons.AddNewPlaylist });
        expect(addPlaylistButton).toBeInTheDocument();

        // Re-open the form
        await user.click(addPlaylistButton);

        // Assert: Verify the inputs were completely remounted and cleared
        expect(screen.getByLabelText(PlaylistUILabels.InputNameLabel)).toHaveValue('');
        expect(screen.getByLabelText(PlaylistUILabels.InputDescriptionLabel)).toHaveValue('');
    });
});