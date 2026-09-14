import { apiDelete, apiGet, apiPost, apiPut } from "../../../core/api/client";
import { API_ENDPOINTS } from "../../../core/api/config";
import type { Artist, ArtistPayload } from "../types";


export const fetchArtists = async (): Promise<Artist[]> => {
    return await apiGet<Artist[]>(`${API_ENDPOINTS.artists}`);
};

export const fetchArtistById = async (id: string): Promise<Artist> => {
    return await apiGet<Artist>(`${API_ENDPOINTS.artists}/${id}`);
};

export const createArtist = async (newArtist: ArtistPayload): Promise<Artist> => {
    return await apiPost<Artist, ArtistPayload>(`${API_ENDPOINTS.artists}`, newArtist);
};

export const deleteArtist = async (id: string): Promise<void> => {
    await apiDelete(`${API_ENDPOINTS.artists}/${id}`);
};

export const updateArtist = async (id: string, artist: ArtistPayload): Promise<void> => {
    await apiPut<ArtistPayload>(`${API_ENDPOINTS.artists}/${id}`, artist);
};
