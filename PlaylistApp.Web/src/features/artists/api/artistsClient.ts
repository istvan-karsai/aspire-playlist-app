import { apiDelete, apiGet, apiPost, apiPut } from "../../../core/api/client";
import type { Artist, ArtistPayload } from "../types";


export const fetchArtists = async (): Promise<Artist[]> => {
    return await apiGet<Artist[]>('/api/artists');
};

export const fetchArtistById = async (id: string): Promise<Artist> => {
    return await apiGet<Artist>(`/api/artists/${id}`);
};

export const createArtist = async (newArtist: ArtistPayload): Promise<Artist> => {
    return await apiPost<Artist, ArtistPayload>('/api/artists', newArtist);
};

export const deleteArtist = async (id: string): Promise<void> => {
    await apiDelete(`/api/artists/${id}`);
};

export const updateArtist = async (id: string, artist: ArtistPayload): Promise<void> => {
    await apiPut<ArtistPayload>(`/api/artists/${id}`, artist);
};
