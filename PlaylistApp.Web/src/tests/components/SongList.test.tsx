import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SongList } from "../../components/SongList";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { UILabels } from "../../constants/uiText";
import { mockValidSong } from "../mocks/mockData";
import { MemoryRouter } from "react-router-dom";

const renderWithQueryClient = (ui: React.ReactElement) => {
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

describe('SongList Component', () => {
    it('displays a loading indicator while fetching songs', () => {
        renderWithQueryClient(<SongList />);

        expect(screen.getByText(UILabels.LoadingLibrary)).toBeInTheDocument();
    });

    it('displays an empty state message when no songs are returned', async () => {
        server.use(
            http.get('/api/songs', () => {
                return HttpResponse.json([]);
            })
        );

        renderWithQueryClient(<SongList />);

        expect(await screen.findByText(UILabels.EmptyLibrary)).toBeInTheDocument();
    });

    it('renders a list of songs when data is successfully fetched', async () => {
        // Arrange: Render the component
        renderWithQueryClient(<SongList />);

        // Act & Assert: Wait for the async API call to finish and populate the DOM
        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();

        // Target the name of the first artist in the mock array
        expect(screen.getByText(mockValidSong.artists[0].name)).toBeInTheDocument();
        
        expect(screen.getByText(mockValidSong.duration)).toBeInTheDocument();
    });
});