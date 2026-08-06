import { http, HttpResponse } from 'msw';
import type { SongPayload } from '../../types/song';
import { mockSongs, mockValidArtist } from './mockData';
import type { Artist } from '../../types/artist';

export const handlers = [
    // ==========================================
    // SONGS
    // ==========================================
    http.get('/api/songs', () => {
        return HttpResponse.json(mockSongs);
    }),

    http.post('/api/songs', async ({ request }) => {
        const payload = await request.json() as SongPayload;

        const newSong = {
            id: '123e4567-e89b-12d3-a456-843328278000',
            title: payload.title,
            duration: payload.duration,
            artists: [mockValidArtist]
        };

        return HttpResponse.json(newSong, { status: 201 });
    }),

    http.put('/api/songs/:id', async ({ request, params }) => {
        const payload = await request.json() as SongPayload;

        const updatedSong = {
            id: params.id as string,
            title: payload.title,
            duration: payload.duration,
            artists: [mockValidArtist]
        };

        return HttpResponse.json(updatedSong, { status: 200 });
    }),

    http.delete('/api/songs/:id', () => {
        return new HttpResponse(null, { status: 204 });
    }),

    // ==========================================
    // ARTISTS
    // ==========================================
    http.get('/api/artists', () => {
        return HttpResponse.json([mockValidArtist]);
    }),

    http.post('/api/artists', async ({ request }) => {
        const newArtist = await request.json() as Omit<Artist, 'id'>;
        return HttpResponse.json({ id: mockValidArtist.id, ...newArtist }, { status: 201 });
    }),

    http.put('/api/artists/:id', async ({ request, params }) => {
        const updatedArtist = await request.json() as Omit<Artist, 'id'>;
        return HttpResponse.json({ id: params.id as string, ...updatedArtist }, { status: 200 });
    }),

    http.delete('/api/artists/:id', () => {
        return new HttpResponse(null, { status: 204 });
    }),
];