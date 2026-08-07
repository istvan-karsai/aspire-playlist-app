import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ArtistForm } from "../../components/ArtistForm";
import { UIButtons, UILabels, ValidationMessages } from "../../constants/uiText";
import { describe, expect, it } from "vitest";

const renderQueryWithClient = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </QueryClientProvider>
    );
};

const setupAndFillForm = async (yearValue: string) => {
    const user = userEvent.setup();
    renderQueryWithClient(<ArtistForm />);

    const nameInput = screen.getByLabelText(UILabels.InputNameLabel);
    const activeFromInput = screen.getByLabelText(UILabels.InputActiveFromLabel);
    const countryInput = screen.getByLabelText(UILabels.InputCountryLabel);
    const submitButton = screen.getByRole('button', { name: UIButtons.Save });

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

        expect(await screen.findByText(ValidationMessages.InvalidYear)).toBeInTheDocument();
    });

    it('successfully submits the form with valid data and clears inputs', async () => {
        // Fill form with a valid year
        const { user, submitButton } = await setupAndFillForm('2015');

        await user.click(submitButton);

        await waitFor(async () => {
            expect(screen.getByLabelText(UILabels.InputNameLabel)).toHaveValue('');
            expect(screen.getByLabelText(UILabels.InputCountryLabel)).toHaveValue('');

            // Asserting empty string for number input
            expect(screen.getByLabelText(UILabels.InputActiveFromLabel)).toHaveValue(null);
        });
    });
});