import { songHandlers } from '../../features/songs/tests/songHandlers';
import { artistHandlers } from '../../features/artists/tests/artistHandlers';

export const handlers = [
    ...songHandlers,
    ...artistHandlers
];