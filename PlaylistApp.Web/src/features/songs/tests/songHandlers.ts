import { http, HttpResponse } from "msw";
import { mockSongs } from "./songMocks";
import type { SongPayload } from "../types";
import { mockArtists } from "../../artists/tests/artistMocks";

export const songHandlers = [
    http.get('/api/songs', ({ request }) => {
        const url = new URL(request.url);
        const artistId = url.searchParams.get('artistId');

        if (artistId) {
            const filteredSongs = mockSongs.filter((song) => 
                song.artists.some((artist) => artist.id === artistId)
            );

            return HttpResponse.json(filteredSongs);
        }

        return HttpResponse.json(mockSongs);
    }),

    http.post('/api/songs', async ({ request }) => {
        const payload = await request.json() as SongPayload;

        const newSong = {
            id: '123e4567-e89b-12d3-a456-843328278000',
            title: payload.title,
            duration: payload.duration,
            artists: mockArtists
        };

        return HttpResponse.json(newSong, { status: 201 });
    }),

    http.put('/api/songs/:id', async ({ request }) => {
        await request.json();
        return new HttpResponse(null, { status: 204 });
    }),

    http.delete('/api/songs/:id', () => {
        return new HttpResponse(null, { status: 204 });
    }),
];