import type { Song } from "../../types/song";

export const mockValidSong: Song = {
    id: '123e4567-e89b-12d3-a456-426614174000', 
    title: 'Test Song 1', 
    artist: 'Test Artist', 
    duration: '00:03:00'
};

export const mockSongs: Song[] = [
    mockValidSong
];