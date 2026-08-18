import { useQuery } from "@tanstack/react-query";
import { fetchPlaylistById, fetchPlaylists } from "../api/playlistsClient";

export const usePlaylists = () => {
    return useQuery({
        queryKey: ['playlists'],
        queryFn: fetchPlaylists
    });
};

export const usePlaylist = (id: string) => {
    return useQuery({
        queryKey: ['playlists', id],
        queryFn: () => fetchPlaylistById(id!),
        enabled: !!id,
    });
};