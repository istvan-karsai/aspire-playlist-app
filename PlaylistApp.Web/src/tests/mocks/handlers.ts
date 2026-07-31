import { http, HttpResponse } from 'msw';
import type { Song } from '../../types/song';

const mockSongs = [
    { id: '123e4567-e89b-12d3-a456-426614174000', title: 'Test Song 1', artist: 'Test Artist', duration: '00:03:00' },
];

export const handlers = [
    http.get('/api/songs', () => {
        return HttpResponse.json(mockSongs);
    }),

    http.post('/api/songs', async ({ request }) => {
        const newSong = await request.json() as Omit<Song, 'id'>;
        return HttpResponse.json({ id: '123e4567-e89b-12d3-a456-843328278000', ...newSong }, { status: 201 });
    }),

    http.put('/api/songs/:id', async ({ request, params }) => {
        const updatedSong = await request.json() as Omit<Song, 'id'>;
        return HttpResponse.json({ id: params.id, ...updatedSong }, { status: 200 });
    }),

    http.delete('/api/songs/:id', () => {
        return new HttpResponse(null, { status: 204 });
    })
];