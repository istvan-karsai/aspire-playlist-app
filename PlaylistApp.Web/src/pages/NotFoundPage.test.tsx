import { describe, expect, it } from "vitest";
import { NotFoundPage } from "./NotFoundPage";
import { CoreUIErrors } from "../core/constants/uiText";
import { render, screen } from "../tests/utils/test-utils";

describe('NotFoundPage Component', () => {
    it('displays the 404 error message and navigation link', () => {
        // By using the test-utils render, the component is automatically wrapped in a MemoryRouter
        render(<NotFoundPage />);

        // Assert against the source of truth constants
        expect(screen.getByText(CoreUIErrors.NotFoundTitle)).toBeInTheDocument();
        expect(screen.getByText(CoreUIErrors.NotFoundSubtitle)).toBeInTheDocument();
        expect(screen.getByText(CoreUIErrors.NotFoundMessage)).toBeInTheDocument();

        // Verify the recovery link is present
        const backLink = screen.getByRole('link', { name: CoreUIErrors.NotFoundBackLink });
        expect(backLink).toBeInTheDocument();
    });
});