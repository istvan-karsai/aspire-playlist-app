import { http, HttpResponse } from "msw";
import { mockPlaylists, mockValidPlaylist, mockEmptyPlaylist } from "./playlistMocks";
import type { PlaylistPayload } from "../types";

export const playlistHandlers = [
    http.get('/api/playlists', () => {
        return HttpResponse.json(mockPlaylists);
    }),

    http.get('/api/playlists/:id', ({ params }) => {
        const { id } = params;

        if (id === mockValidPlaylist.id) {
            return HttpResponse.json(mockValidPlaylist);
        }
        
        if (id === mockEmptyPlaylist.id) {
            return HttpResponse.json(mockEmptyPlaylist);
        }

        return new HttpResponse(null, { status: 404 });
    }),

    http.post('/api/playlists', async ({ request }) => {
        const newPlaylist = await request.json() as PlaylistPayload;
        return HttpResponse.json({ id: mockValidPlaylist.id, ...newPlaylist }, { status: 201 });
    }),

    http.put('/api/playlists/:id', async ({ request }) => {
        await request.json();
        return new HttpResponse(null, { status: 204 });
    }),

    http.delete('/api/playlists/:id', () => {
        return new HttpResponse(null, { status: 204 });
    }),
];