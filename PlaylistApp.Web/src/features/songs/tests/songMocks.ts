import { mockValidArtist, mockValidArtist2 } from "../../artists/tests/artistMocks";
import type { Song } from "../types";

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
