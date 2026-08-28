import { songHandlers } from '../../features/songs/tests/songHandlers';
import { artistHandlers } from '../../features/artists/tests/artistHandlers';
import { playlistHandlers } from '../../features/playlists/tests/playlistHandlers';

export const handlers = [
    ...songHandlers,
    ...artistHandlers,
    ...playlistHandlers
];