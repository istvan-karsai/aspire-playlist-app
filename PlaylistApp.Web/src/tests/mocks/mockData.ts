import type { Artist } from "../../types/artist";
import type { Song } from "../../types/song";

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

export const mockValidSong: Song = {
    id: '123e4567-e89b-12d3-a456-426614174000', 
    title: 'Test Song 1', 
    artists: [mockValidArtist], 
    duration: '00:03:00'
};

export const mockValidSong2: Song = {
    id: '223e4567-e89b-12d3-a456-426614174111',
    title: 'Test Song 2',
    artists: [mockValidArtist2],
    duration: '00:04:00'
};

export const mockSongs: Song[] = [
    mockValidSong,
    mockValidSong2
];

export const mockArtists: Artist[] = [
    mockValidArtist,
    mockValidArtist2,
    mockArtistWithoutSong
];