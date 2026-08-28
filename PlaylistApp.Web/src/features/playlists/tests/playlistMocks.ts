import { mockValidSong } from "../../songs/tests/songMocks";
import type { Playlist } from "../types";

export const mockValidPlaylist: Playlist = {
    id: '111e6543-e21b-34d5-c678-426614174111',
    name: 'Test Playlist',
    description: 'A great test playlist for our tests.',
    createdAt: '2026-08-28T08:00:00Z',
    songs: [mockValidSong]
};

export const mockEmptyPlaylist: Playlist = {
    id: '222e6543-e21b-34d5-c678-426614174222',
    name: 'Empty Playlist',
    description: 'A playlist with no songs',
    createdAt: '2026-08-28T08:00:00Z',
    songs: []
};

export const mockPlaylists: Playlist[] = [
    mockValidPlaylist,
    mockEmptyPlaylist
];