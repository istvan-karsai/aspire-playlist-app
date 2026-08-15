import { apiFetch } from "../../../api/core";
import type { Artist } from "../types";


export const fetchArtists = async (): Promise<Artist[]> => {
    const response = await apiFetch('/api/artists');

    return response.json();
};

export const fetchArtistById = async (id: string): Promise<Artist> => {
    const response = await apiFetch(`/api/artists/${id}`);

    return response.json();
};

export const createArtist = async (newArtist: Omit<Artist, 'id'>): Promise<Artist> => {
    const response = await apiFetch('/api/artists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArtist),
    });

    return response.json();
};

export const deleteArtist = async (id: string): Promise<void> => {
    await apiFetch(`/api/artists/${id}`, {
        method: 'DELETE',
    });
};

export const updateArtist = async (id: string, artist: Omit<Artist, 'id'>): Promise<void> => {
    await apiFetch(`/api/artists/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(artist),
    });
};
