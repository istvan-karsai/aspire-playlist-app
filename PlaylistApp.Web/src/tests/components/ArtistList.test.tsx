import { render, screen } from "../utils/test-utils";
import { describe, expect, it } from "vitest";
import { ArtistList } from "../../components/ArtistList";
import { UILabels } from "../../constants/uiText";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { mockValidArtist } from "../mocks/mockData";

describe('ArtistList Component', () => {
    it('displays a loading indicator while fetching artists', () => {
        render(<ArtistList />);

        expect(screen.getByText(UILabels.LoadingArtistLibrary)).toBeInTheDocument();
    });

    it('displays an empty state message when no artists are returned', async () => {
        server.use(
            http.get('/api/artists', () => {
                return HttpResponse.json([]);
            })
        );

        render(<ArtistList />);

        expect(await screen.findByText(UILabels.EmptyArtistLibrary)).toBeInTheDocument();
    });
    
    it('renders a list of artists when data is successfully fetched', async () => {
        render(<ArtistList />);

        expect(await screen.findByText(mockValidArtist.name)).toBeInTheDocument();

        // Target the standard table fallback character for missing optional data (except image URL)
        const fallbackElements = screen.getAllByText(UILabels.EmptyArtistsFallback);

        // We expect fallbacks for bio, country, and activeFromYear since our mock doesn't include them
        expect(fallbackElements).toHaveLength(3);
    });
});