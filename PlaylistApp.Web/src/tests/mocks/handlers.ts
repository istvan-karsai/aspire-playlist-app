import { http, HttpResponse } from 'msw';
import type { SongPayload } from '../../types/song';
import { mockArtists, mockSongs, mockValidArtist } from './mockData';
import type { Artist } from '../../types/artist';

export const handlers = [
    // ==========================================
    // SONGS
    // ==========================================
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

    // ==========================================
    // ARTISTS
    // ==========================================
    http.get('/api/artists', () => {
        return HttpResponse.json(mockArtists);
    }),

    http.get('/api/artists/:id', ({ params }) => {
        const { id } = params;

        if (id === mockValidArtist.id) {
            return HttpResponse.json(mockValidArtist);
        }

        return new HttpResponse(null, { status: 404 });
    }),

    http.post('/api/artists', async ({ request }) => {
        const newArtist = await request.json() as Omit<Artist, 'id'>;
        return HttpResponse.json({ id: mockValidArtist.id, ...newArtist }, { status: 201 });
    }),

    http.put('/api/artists/:id', async ({ request }) => {
        await request.json();
        return new HttpResponse(null, { status: 204 });
    }),

    http.delete('/api/artists/:id', () => {
        return new HttpResponse(null, { status: 204 });
    }),
];