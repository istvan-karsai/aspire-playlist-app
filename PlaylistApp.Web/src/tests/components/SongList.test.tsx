import { render, screen } from "../utils/test-utils";
import { describe, expect, it } from "vitest";
import { SongList } from "../../components/SongList";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { UILabels } from "../../constants/uiText";
import { mockValidSong } from "../mocks/mockData";

describe('SongList Component', () => {
    it('displays a loading indicator while fetching songs', () => {
        render(<SongList />);

        expect(screen.getByText(UILabels.LoadingLibrary)).toBeInTheDocument();
    });

    it('displays an empty state message when no songs are returned', async () => {
        server.use(
            http.get('/api/songs', () => {
                return HttpResponse.json([]);
            })
        );

        render(<SongList />);

        expect(await screen.findByText(UILabels.EmptyLibrary)).toBeInTheDocument();
    });

    it('renders a list of songs when data is successfully fetched', async () => {
        // Arrange: Render the component
        render(<SongList />);

        // Act & Assert: Wait for the async API call to finish and populate the DOM
        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();

        // Target the name of the first artist in the mock array
        expect(screen.getByText(mockValidSong.artists[0].name)).toBeInTheDocument();
        
        expect(screen.getByText(mockValidSong.duration)).toBeInTheDocument();
    });
});