import { http, HttpResponse } from "msw";
import { mockArtists, mockValidArtist } from "./artistMocks";
import type { Artist } from "../types";
import { API_ENDPOINTS } from "../../../core/api/config";

export const artistHandlers = [
    http.get(`${API_ENDPOINTS.artists}`, () => {
        return HttpResponse.json(mockArtists);
    }),

    http.get(`${API_ENDPOINTS.artists}/:id`, ({ params }) => {
        const { id } = params;

        if (id === mockValidArtist.id) {
            return HttpResponse.json(mockValidArtist);
        }

        return new HttpResponse(null, { status: 404 });
    }),

    http.post(`${API_ENDPOINTS.artists}`, async ({ request }) => {
        const newArtist = await request.json() as Omit<Artist, 'id'>;
        return HttpResponse.json({ id: mockValidArtist.id, ...newArtist }, { status: 201 });
    }),

    http.put(`${API_ENDPOINTS.artists}/:id`, async ({ request }) => {
        await request.json();
        return new HttpResponse(null, { status: 204 });
    }),

    http.delete(`${API_ENDPOINTS.artists}/:id`, () => {
        return new HttpResponse(null, { status: 204 });
    }),
];