import { http, HttpResponse } from "msw";
import { mockSongs, mockValidSong, mockValidSong2 } from "./songMocks";
import type { SongPayload } from "../types";
import { mockArtists } from "../../artists/tests/artistMocks";
import { API_ENDPOINTS } from "../../../core/api/config";

export const songHandlers = [
    http.get(`${API_ENDPOINTS.songs}`, ({ request }) => {
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

    http.get(`${API_ENDPOINTS.songs}/:id`, ({ params }) => {
        const { id } = params;
    
        if (id === mockValidSong.id) {
            return HttpResponse.json(mockValidSong);
        }
            
        if (id === mockValidSong2.id) {
            return HttpResponse.json(mockValidSong2);
        }
    
        return new HttpResponse(null, { status: 404 });
    }),

    http.post(`${API_ENDPOINTS.songs}`, async ({ request }) => {
        const payload = await request.json() as SongPayload;

        const newSong = {
            id: '123e4567-e89b-12d3-a456-843328278000',
            title: payload.title,
            duration: payload.duration,
            artists: mockArtists
        };

        return HttpResponse.json(newSong, { status: 201 });
    }),

    http.put(`${API_ENDPOINTS.songs}/:id`, async ({ request }) => {
        await request.json();
        return new HttpResponse(null, { status: 204 });
    }),

    http.delete(`${API_ENDPOINTS.songs}/:id`, () => {
        return new HttpResponse(null, { status: 204 });
    }),
];