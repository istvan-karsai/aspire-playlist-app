import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../tests/utils/test-utils";
import { SongList } from "./SongList";
import { UILabels } from "../../../constants/uiText";
import { server } from "../../../tests/mocks/server";
import { mockArtistWithoutSong, mockValidArtist } from "../../artists/tests/artistMocks";
import { mockValidSong, mockValidSong2 } from "../tests/songMocks";

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

        // Use getAllByText because the name is in the dropdown AND the table
        expect(screen.getAllByText(mockValidSong.artists[0].name)).toHaveLength(2);
        
        expect(screen.getByText(mockValidSong.duration)).toBeInTheDocument();
    });

    it('filters the song list and displays the empty discography message when selected artist has no songs', async () => {
        const user = userEvent.setup();
        render(<SongList />);

        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();

        const filterSelect = screen.getByLabelText(UILabels.FilterByArtist);
        await user.selectOptions(filterSelect, mockArtistWithoutSong.id);

        expect(await screen.findByText(UILabels.EmptyDiscography)).toBeInTheDocument();
        expect(screen.queryByText(mockValidSong.title)).not.toBeInTheDocument();
    });

    it('filters the song list and displays only the songs for the selected artist', async () => {
        const user = userEvent.setup();
        render(<SongList />);

        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();
        expect(screen.getByText(mockValidSong2.title)).toBeInTheDocument();

        const filterSelect = screen.getByLabelText(UILabels.FilterByArtist);
        await user.selectOptions(filterSelect, mockValidArtist.id);

        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();
        expect(screen.queryByText(mockValidSong2.title)).not.toBeInTheDocument();
    });
});