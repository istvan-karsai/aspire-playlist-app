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
    it('shows a client-side validation error if the duration format is invalid', async () => {
        // Arrange & Act: Fill and submit form with invalid duration
        const { user, submitButton } = await setupAndFillForm('invalid-time');

        document.querySelector('form')?.setAttribute('novalidate', 'true');
        await user.click(submitButton);

        // Assert: Verify custom React validation fires
        expect(await screen.findByText(ValidationMessages.InvalidDurationFormat)).toBeInTheDocument();
    });

    it('successfully submits the form with valid data and clears inputs', async () => {
        // Arrange & Act: Fill and submit form with valid duration
        const { user, submitButton } = await setupAndFillForm('00:05:55');

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