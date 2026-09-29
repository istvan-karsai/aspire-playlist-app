import { render, screen } from "../tests/utils/test-utils";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { GlobalErrorBoundary } from "./GlobalErrorBoundary";
import { CoreUIErrors } from "../core/constants/uiText";

const INTENTIONAL_ERROR_MESSAGE = "This is an intentional test error.";

// Dummy component that intentionally crashes React
const BrokenComponent = () => {
    throw new Error(INTENTIONAL_ERROR_MESSAGE);
};

describe('GlobalErrorBoundary Component', () => {
    
    beforeEach(() => {
        // Mute console.error so the intentional React crash doesn't pollute the test output
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore all mocks (including console.error) after the test finishes
        vi.restoreAllMocks();
    });

    it('renders child components normally when there is no error', () => {
        render(
            <GlobalErrorBoundary>
                <div data-testid="safe-child">Safe Content</div>
            </GlobalErrorBoundary>
        );

        expect(screen.getByTestId("safe-child")).toBeInTheDocument();
        expect(screen.queryByText(CoreUIErrors.BoundaryTitle)).not.toBeInTheDocument();
    });

    it('catches React render errors and displays the fallback UI', () => {
        render(
            <GlobalErrorBoundary>
                <BrokenComponent />
            </GlobalErrorBoundary>
        );

        // Verify the fallback UI title and message rendered
        expect(screen.getByText(CoreUIErrors.BoundaryTitle)).toBeInTheDocument();
        expect(screen.getByText(CoreUIErrors.BoundaryMessage)).toBeInTheDocument();

        // Verify the diagnostic error text (the actual error message thrown by BrokenComponent)
        expect(screen.getByText(`Error: ${INTENTIONAL_ERROR_MESSAGE}`)).toBeInTheDocument();

        // Verify the recovery buttons are present
        expect(screen.getByRole('button', { name: CoreUIErrors.BoundaryRefreshPage })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: CoreUIErrors.BoundaryBackToHome })).toBeInTheDocument();

        // Assert directly against the console object!
        expect(console.error).toHaveBeenCalled();
    });
});