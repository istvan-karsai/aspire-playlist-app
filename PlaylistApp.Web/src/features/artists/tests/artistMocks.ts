import type { Artist } from "../types";

export const mockValidArtist: Artist = {
    id: '987e6543-e21b-34d5-c678-426614174111',
    name: 'Test Artist'
};

export const mockValidArtist2: Artist = {
    id: '887e6543-e21b-34d5-c678-426614174222',
    name: 'Second Test Artist'
};

export const mockArtistWithoutSong: Artist = {
    id: '777e6543-e21b-34d5-c678-426614174333',
    name: 'Empty Artist'
};

export const mockArtists: Artist[] = [
    mockValidArtist,
    mockValidArtist2,
    mockArtistWithoutSong
];