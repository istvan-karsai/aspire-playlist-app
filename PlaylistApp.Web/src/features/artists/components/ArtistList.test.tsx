import { render, screen } from "../../../tests/utils/test-utils";
import { describe, expect, it } from "vitest";
import { ArtistList } from "./ArtistList";
import { server } from "../../../tests/mocks/server";
import { http, HttpResponse } from "msw";
import { mockArtists, mockValidArtist } from "../tests/artistMocks";
import { ArtistUILabels } from "../constants/uiText";
import { CoreUILabels } from "../../../core/constants/uiText";

describe('ArtistList Component', () => {
    it('displays a loading indicator while fetching artists', () => {
        render(<ArtistList />);

        expect(screen.getByText(ArtistUILabels.LoadingArtistLibrary)).toBeInTheDocument();
    });

    it('displays an empty state message when no artists are returned', async () => {
        server.use(
            http.get('/api/artists', () => {
                return HttpResponse.json([]);
            })
        );

        render(<ArtistList />);

        expect(await screen.findByText(ArtistUILabels.EmptyArtistLibrary)).toBeInTheDocument();
    });
    
    it('renders a list of artists when data is successfully fetched', async () => {
        render(<ArtistList />);

        expect(await screen.findByText(mockValidArtist.name)).toBeInTheDocument();

        // Target the standard table fallback character for missing optional data
        const fallbackElements = screen.getAllByText(CoreUILabels.EmptyValueFallback);

        // Define the optional properties where we expect the fallback character to be rendered if missing
        const optionalTableColumns = ['bio', 'activeFromYear', 'country'] as const;

        // Dynamically calculate expected fallback characters based on missing table data
        const expectedFallbackCount = mockArtists.reduce((count, artist) => {
            const missingInTable = optionalTableColumns.filter(prop => !artist[prop]).length;
            return count + missingInTable;
        }, 0);

        expect(fallbackElements).toHaveLength(expectedFallbackCount);
    });
});