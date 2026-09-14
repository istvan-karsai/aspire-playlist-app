import { render, screen } from "../../../tests/utils/test-utils";
import { describe, expect, it } from "vitest";
import { PlaylistList } from "./PlaylistList";
import { server } from "../../../tests/mocks/server";
import { http, HttpResponse } from "msw";
import { mockEmptyPlaylist, mockValidPlaylist } from "../tests/playlistMocks";
import { PlaylistUILabels } from "../constants/uiText";
import { API_ENDPOINTS } from "../../../core/api/config";

describe('PlaylistList Component', () => {
    it('displays a loading indicator while fetching playlists', () => {
        render(<PlaylistList />);

        expect(screen.getByText(PlaylistUILabels.LoadingPlaylistLibrary)).toBeInTheDocument();
    });

    it('displays an error message when fetching fails', async () => {
        server.use(
            http.get(API_ENDPOINTS.playlists, () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        render(<PlaylistList />);

        expect(await screen.findByText(PlaylistUILabels.ErrorLoadingPlaylistsHeader)).toBeInTheDocument();
    });

    it('displays an empty state message when no playlists are returned', async () => {
        server.use(
            http.get(API_ENDPOINTS.playlists, () => {
                return HttpResponse.json([]);
            })
        );

        render(<PlaylistList />);

        expect(await screen.findByText(PlaylistUILabels.EmptyPlaylistLibrary)).toBeInTheDocument();
    });
    
    it('renders a list of playlists when data is successfully fetched', async () => {
        render(<PlaylistList />);

        expect(await screen.findByText(mockValidPlaylist.name)).toBeInTheDocument();
        expect(screen.getByText(mockValidPlaylist.description!)).toBeInTheDocument();
        expect(screen.getByText(mockEmptyPlaylist.name)).toBeInTheDocument();
        expect(screen.getByText(mockEmptyPlaylist.description!)).toBeInTheDocument();
    });
});