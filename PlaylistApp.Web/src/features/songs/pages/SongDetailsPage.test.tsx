import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { SongDetailsPage } from "../pages/SongDetailsPage";
import { server } from "../../../tests/mocks/server";
import { SongUILabels } from "../constants/uiText";
import { API_ENDPOINTS } from "../../../core/api/config";
import { mockValidSong } from "../tests/songMocks";

const renderSongDetailsPage = (songId: string) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[`/songs/${songId}`]}>
                <Routes>
                    <Route path="/songs/:id" element={<SongDetailsPage />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('SongDetailsPage Component', () => {
    it('displays a loading indicator while fetching data', () => {
        renderSongDetailsPage(mockValidSong.id);

        expect(screen.getByText(SongUILabels.LoadingSongDetails)).toBeInTheDocument();
    });

    it('displays an error message if the song fetch fails', async () => {
        server.use(
            http.get(`${API_ENDPOINTS.songs}/:id`, () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        renderSongDetailsPage(mockValidSong.id);

        expect(await screen.findByText(SongUILabels.ErrorLoadingSong)).toBeInTheDocument();
    });

    it('displays the song details and artists on successful fetch', async () => {
        renderSongDetailsPage(mockValidSong.id);

        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();
        
        // Use a regex to match the duration label and value output seamlessly
        expect(screen.getByText(new RegExp(mockValidSong.duration))).toBeInTheDocument();
        expect(screen.getByText(mockValidSong.artists[0].name)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: new RegExp(SongUILabels.BackToSongs, 'i') })).toBeInTheDocument();
    });

    it('displays an empty list message if the song has no assigned artists', async () => {
        server.use(
            http.get(`${API_ENDPOINTS.songs}/:id`, () => {
                // Return the valid song but manually override the artists array to be empty
                return HttpResponse.json({ ...mockValidSong, artists: [] });
            })
        );

        renderSongDetailsPage(mockValidSong.id);

        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();
        expect(screen.getByText(SongUILabels.EmptyArtistsList)).toBeInTheDocument();
    });
});