import type { Song } from "../types/song";

export class ApiValidationError extends Error {
    public messages: string[];

    constructor(messages: string[]) {
        super("Validation Failed");
        this.messages = messages;
        this.name = "ApiValidationError";
    }
}

export const fetchSongs = async (): Promise<Song[]> => {
    const response = await fetch('/api/songs');

    if (!response.ok) {
        throw new Error('Failed to fetch songs from the backend API');
    }

    return response.json();
};

export const createSong = async (newSong: Omit<Song, 'id'>): Promise<Song> => {
    const response = await fetch('/api/songs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSong),
    });

    if (!response.ok) {
        try {
            const errorData = await response.json();

            if (errorData.errors) {
                const allMessages = Object.values(errorData.errors).flat() as string[];
                throw new ApiValidationError(allMessages);
            }
        } catch (e) {
            if (e instanceof ApiValidationError) throw e;
            if (e instanceof Error && e.message != 'Unexpected end of JSON input') throw e;
        }
        throw new Error('An unexpected error occurred while saving.');
    }

    return response.json();
};

export const deleteSong = async (id: string): Promise<void> => {
    const response = await fetch(`/api/songs/${id}`, {
        method: 'DELETE',
    });

    if (response.status === 404) {
        throw new Error('This song could not be found. It may have already been deleted.');
    }

    if (!response.ok) {
        throw new Error('A server error occurred while trying to delete this song. Please try again later.');
    }
};