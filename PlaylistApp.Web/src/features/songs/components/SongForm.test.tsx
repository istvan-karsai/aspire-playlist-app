import { render, screen } from '../../../tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SongForm } from './SongForm';
import { mockValidArtist } from "../../artists/tests/artistMocks";
import { SongUIButtons, SongUILabels, SongValidationMessages } from '../constants/uiText';
import { CoreUIButtons } from '../../../core/constants/uiText';


const setupAndFillForm = async (durationValue: string) => {
    const user = userEvent.setup();
    render(<SongForm />);

    const addSongButton = screen.getByRole('button', { name: SongUIButtons.AddNewSong });
    await user.click(addSongButton);

    const titleInput = screen.getByLabelText(SongUILabels.InputTitleLabel);

    const artistCheckBox = await screen.findByRole('checkbox', { name: mockValidArtist.name });
    
    const durationInput = screen.getByLabelText(SongUILabels.InputDurationLabel);
    const submitButton = screen.getByRole('button', { name: CoreUIButtons.Save });

    await user.type(titleInput, 'Bohemian Rhapsody');
    await user.click(artistCheckBox);
    await user.type(durationInput, durationValue);

    return { user, submitButton };
};

describe('SongForm Component', () => {
    it.each([
        ['invalid-time', 'completely invalid format', SongValidationMessages.InvalidDurationFormat],
        ['24:00:00', 'out of bounds hours', SongValidationMessages.InvalidDurationFormat],
        ['00:60:00', 'out of bounds minutes', SongValidationMessages.InvalidDurationFormat],
        ['00:00:60', 'out of bounds seconds', SongValidationMessages.InvalidDurationFormat],
        ['00:00:00', 'exactly zero', SongValidationMessages.DurationGreaterThanZero]
    ])(
        'shows a client-side validation error if the duration is %s (%s)', 
        async (invalidDuration: string, _description: string, expectedErrorMessage: string) => {
            // Arrange: Fill the form with invalid duration and disable HTML5 validation
            const { user, submitButton } = await setupAndFillForm(invalidDuration);
            document.querySelector('form')?.setAttribute('novalidate', 'true');

            // Act: Attempt to submit the form
            await user.click(submitButton);

            // Assert: Verify the correct custom validation error fires based on the input
            expect(await screen.findByText(expectedErrorMessage)).toBeInTheDocument();
        }
    );

    it('successfully submits the form with valid data and clears inputs', async () => {
        // Arrange & Act: Fill and submt the form with valid duration
        const { user, submitButton } = await setupAndFillForm('00:05:55');
        await user.click(submitButton);

        // Wait for the form to automatically close upon success
        const addSongButton = await screen.findByRole('button', { name: SongUIButtons.AddNewSong });
        expect(addSongButton).toBeInTheDocument();

        // Re-open the form
        await user.click(addSongButton);

        // Assert: Verify the inputs were completely remounted and cleared
        expect(screen.getByLabelText(SongUILabels.InputTitleLabel)).toHaveValue('');

        const resetCheckbox = await screen.findByRole('checkbox', { name: mockValidArtist.name });
        expect(resetCheckbox).not.toBeChecked();
            
        expect(screen.getByLabelText(SongUILabels.InputDurationLabel)).toHaveValue('');
    });
});