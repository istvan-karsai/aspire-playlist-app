import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PlaylistDetailsPage } from "./PlaylistDetailsPage";
import { describe, expect, it } from "vitest";
import { mockEmptyPlaylist, mockValidPlaylist } from "../tests/playlistMocks";
import { PlaylistUILabels } from "../constants/uiText";
import { server } from "../../../tests/mocks/server";
import { http, HttpResponse } from "msw";
import { mockValidSong } from "../../songs/tests/songMocks";

const renderPlaylistDetailsPage = (playlistId: string) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[`/playlists/${playlistId}`]}>
                <Routes>
                    <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('PlaylistDetailsPage Component', () => {
    it('displays a loading indicator while fetching data', () => {
        renderPlaylistDetailsPage(mockValidPlaylist.id);

        expect(screen.getByText(PlaylistUILabels.LoadingPlaylistDetails)).toBeInTheDocument();
    });

    it('displays an error message if the playlist fetch fails', async () => {
        server.use(
            http.get('/api/playlists/:id', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        renderPlaylistDetailsPage(mockValidPlaylist.id);

        expect(await screen.findByText(PlaylistUILabels.ErrorLoadingPlaylistProfile)).toBeInTheDocument();
    });

    it('displays the playlist profile and tracklist on successful fetch', async () => {
        renderPlaylistDetailsPage(mockValidPlaylist.id);

        // Verify Profile Metadata
        expect(await screen.findByText(mockValidPlaylist.name)).toBeInTheDocument();
        expect(await screen.findByText(mockValidPlaylist.description!)).toBeInTheDocument();
        
        // Verify Relational Song Mapping
        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();
        
        // Verify Navigation
        expect(screen.getByRole('link', { name: new RegExp(PlaylistUILabels.BackToPlaylists, 'i') })).toBeInTheDocument();
    });

    it('displays an empty tracklist message if the playlist has no songs', async () => {
        renderPlaylistDetailsPage(mockEmptyPlaylist.id);

        expect(await screen.findByText(mockEmptyPlaylist.name)).toBeInTheDocument();
        expect(screen.getByText(PlaylistUILabels.EmptyTracks)).toBeInTheDocument();
    });
});