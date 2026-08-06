import type { Artist } from "../../types/artist";
import type { Song } from "../../types/song";

export const mockValidArtist: Artist = {
    id: '987e6543-e21b-34d5-c678-426614174111',
    name: 'Test Artist'
};

export const mockValidSong: Song = {
    id: '123e4567-e89b-12d3-a456-426614174000', 
    title: 'Test Song 1', 
    artists: [mockValidArtist], 
    duration: '00:03:00'
};

export const mockSongs: Song[] = [
    mockValidSong
];