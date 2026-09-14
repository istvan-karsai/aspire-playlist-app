import { http, HttpResponse } from "msw";
import { mockPlaylists, mockValidPlaylist, mockEmptyPlaylist } from "./playlistMocks";
import type { PlaylistPayload } from "../types";
import { API_ENDPOINTS } from "../../../core/api/config";

export const playlistHandlers = [
    http.get(`${API_ENDPOINTS.playlists}`, () => {
        return HttpResponse.json(mockPlaylists);
    }),

    http.get(`${API_ENDPOINTS.playlists}/:id`, ({ params }) => {
        const { id } = params;

        if (id === mockValidPlaylist.id) {
            return HttpResponse.json(mockValidPlaylist);
        }
        
        if (id === mockEmptyPlaylist.id) {
            return HttpResponse.json(mockEmptyPlaylist);
        }

        return new HttpResponse(null, { status: 404 });
    }),

    http.post(`${API_ENDPOINTS.playlists}`, async ({ request }) => {
        const newPlaylist = await request.json() as PlaylistPayload;
        return HttpResponse.json({ id: mockValidPlaylist.id, ...newPlaylist }, { status: 201 });
    }),

    http.put(`${API_ENDPOINTS.playlists}/:id`, async ({ request }) => {
        await request.json();
        return new HttpResponse(null, { status: 204 });
    }),

    http.delete(`${API_ENDPOINTS.playlists}/:id`, () => {
        return new HttpResponse(null, { status: 204 });
    }),
];