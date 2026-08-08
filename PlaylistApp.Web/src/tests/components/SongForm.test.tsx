import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SongForm } from '../../components/SongForm';
import { UIButtons, UILabels, ValidationMessages } from '../../constants/uiText';
import { mockValidArtist } from '../mocks/mockData';


const setupAndFillForm = async (durationValue: string) => {
    const user = userEvent.setup();
    render(<SongForm />);

    const titleInput = screen.getByLabelText(UILabels.InputTitleLabel);

    const artistCheckBox = await screen.findByRole('checkbox', { name: mockValidArtist.name });
    
    const durationInput = screen.getByLabelText(UILabels.InputDurationLabel);
    const submitButton = screen.getByRole('button', { name: UIButtons.Save });

    await user.type(titleInput, 'Bohemian Rhapsody');
    await user.click(artistCheckBox);
    await user.type(durationInput, durationValue);

    return { user, submitButton };
};

describe('SongForm Component', () => {
    it.each([
        ['invalid-time', 'completely invalid format', ValidationMessages.InvalidDurationFormat],
        ['24:00:00', 'out of bounds hours', ValidationMessages.InvalidDurationFormat],
        ['00:60:00', 'out of bounds minutes', ValidationMessages.InvalidDurationFormat],
        ['00:00:60', 'out of bounds seconds', ValidationMessages.InvalidDurationFormat],
        ['00:00:00', 'exactly zero', ValidationMessages.DurationGreaterThanZero]
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
    });

    it('successfully submits the form with valid data and clears inputs', async () => {
        // Arrange: Fill the form with valid duration
        const { user, submitButton } = await setupAndFillForm('00:05:55');

        // Act: Submit the form
        await user.click(submitButton);

        // Assert: Re-query the DOM to ensure the form was completely remounted and cleared
        await waitFor(async () => {
            expect(screen.getByLabelText(UILabels.InputTitleLabel)).toHaveValue('');

            const resetCheckbox = await screen.findByRole('checkbox', { name: mockValidArtist.name });
            expect(resetCheckbox).not.toBeChecked();
            
            expect(screen.getByLabelText(UILabels.InputDurationLabel)).toHaveValue('');
        });
    });
});