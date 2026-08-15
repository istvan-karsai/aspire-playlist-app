import { http, HttpResponse } from "msw";
import { mockArtists, mockValidArtist } from "./artistMocks";
import type { Artist } from "../types";

export const artistHandlers = [
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