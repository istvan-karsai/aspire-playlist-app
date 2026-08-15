import { useQuery } from "@tanstack/react-query";
import { fetchSongs } from "../api/songsClient";

export const useSongs = (artistId?: string) => {
    return useQuery({
        queryKey: ['songs', { artistId }],
        queryFn: () => fetchSongs(artistId),
    });
};