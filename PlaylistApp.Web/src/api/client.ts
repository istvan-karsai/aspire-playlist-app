import type { Song } from "../types/song";

export class ApiValidationError extends Error {
    public messages: string[];

    constructor(messages: string[]) {
        super("Validation Failed");
        this.messages = messages;
        this.name = "ApiValidationError";
    }
}

async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
    let response: Response;

    try {
        response = await fetch(endpoint, options);
    } catch (error) {
        throw new Error('Network error: Could not connect to the server. Please check your connection or try again later.', { cause: error });
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('The requested resource could not be found. It may have already been deleted.');
        }

        try {
            const errorData = await response.json();

            if (errorData.errors) {
                const allMessages = Object.values(errorData.errors).flat() as string[];
                throw new ApiValidationError(allMessages);
            }
        } catch (e) {
            if (e instanceof ApiValidationError) throw e;
            if (e instanceof Error && e.message !== 'Unexpected end of JSON input') throw e;
        }
    }

    return response;
}

export const fetchSongs = async (): Promise<Song[]> => {
    const response = await apiFetch('/api/songs');

    return response.json();
};

export const createSong = async (newSong: Omit<Song, 'id'>): Promise<Song> => {
    const response = await apiFetch('/api/songs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSong),
    });

    return response.json();
};

export const deleteSong = async (id: string): Promise<void> => {
    await apiFetch(`/api/songs/${id}`, {
        method: 'DELETE',
    });
};

export const updateSong = async (id: string, song: Omit<Song, 'id'>): Promise<void> => {
    await apiFetch(`/api/songs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
    });
};